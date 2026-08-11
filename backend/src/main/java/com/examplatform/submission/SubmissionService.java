package com.examplatform.submission;

import com.examplatform.exam.Exam;
import com.examplatform.exam.ExamRepository;
import com.examplatform.exception.BadRequestException;
import com.examplatform.exception.ResourceNotFoundException;
import com.examplatform.question.Answer;
import com.examplatform.question.AnswerRepository;
import com.examplatform.question.Question;
import com.examplatform.question.QuestionRepository;
import com.examplatform.result.Result;
import com.examplatform.result.ResultRepository;
import com.examplatform.result.dto.ResultDto;
import com.examplatform.submission.dto.StudentAnswerRequest;
import com.examplatform.submission.dto.SubmitExamRequest;
import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final ResultRepository resultRepository;

    @Transactional
    public ResultDto submitExam(SubmitExamRequest request, Long studentId) {
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài thi"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học sinh"));

        List<Question> questions = questionRepository.findByExamId(exam.getId());
        if (questions.isEmpty()) {
            throw new BadRequestException("Bài thi này chưa có câu hỏi nào!");
        }

        Submission submission = Submission.builder()
                .exam(exam)
                .student(student)
                .startTime(LocalDateTime.now().minusMinutes(exam.getDurationMinutes()))
                .submitTime(LocalDateTime.now())
                .status("COMPLETED")
                .build();

        Submission savedSubmission = submissionRepository.save(submission);

        int totalQuestions = questions.size();
        int correctAnswersCount = 0;
        double totalEarnedScore = 0.0;
        double maxPossibleScore = questions.stream().mapToDouble(Question::getScore).sum();

        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, Function.identity()));

        if (request.getAnswers() != null) {
            for (StudentAnswerRequest ansReq : request.getAnswers()) {
                Question question = questionMap.get(ansReq.getQuestionId());
                if (question == null) continue;

                Answer selectedAnswer = null;
                if (ansReq.getSelectedAnswerId() != null) {
                    selectedAnswer = answerRepository.findById(ansReq.getSelectedAnswerId()).orElse(null);
                }

                StudentAnswer studentAnswer = StudentAnswer.builder()
                        .submission(savedSubmission)
                        .question(question)
                        .selectedAnswer(selectedAnswer)
                        .build();

                studentAnswerRepository.save(studentAnswer);

                if (selectedAnswer != null && Boolean.TRUE.equals(selectedAnswer.getIsCorrect())) {
                    correctAnswersCount++;
                    totalEarnedScore += question.getScore();
                }
            }
        }

        // Scale to 10-point system
        double finalScore = maxPossibleScore > 0 ? (totalEarnedScore / maxPossibleScore) * 10.0 : 0.0;
        finalScore = Math.round(finalScore * 100.0) / 100.0; // Round to 2 decimals

        boolean isPassed = finalScore >= exam.getPassScore();

        Result result = Result.builder()
                .submission(savedSubmission)
                .student(student)
                .exam(exam)
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswersCount)
                .score(finalScore)
                .isPassed(isPassed)
                .build();

        Result savedResult = resultRepository.save(result);

        return ResultDto.builder()
                .id(savedResult.getId())
                .submissionId(savedSubmission.getId())
                .studentId(student.getId())
                .studentName(student.getFullName())
                .studentEmail(student.getEmail())
                .examId(exam.getId())
                .examTitle(exam.getTitle())
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswersCount)
                .score(finalScore)
                .passScore(exam.getPassScore())
                .isPassed(isPassed)
                .createdAt(savedResult.getCreatedAt())
                .build();
    }
}
