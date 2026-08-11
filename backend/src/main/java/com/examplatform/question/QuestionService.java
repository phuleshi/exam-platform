package com.examplatform.question;

import com.examplatform.exam.Exam;
import com.examplatform.exam.ExamRepository;
import com.examplatform.exception.ResourceNotFoundException;
import com.examplatform.question.dto.AnswerDto;
import com.examplatform.question.dto.CreateQuestionRequest;
import com.examplatform.question.dto.QuestionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;

    public List<QuestionDto> getQuestionsByExamId(Long examId) {
        return questionRepository.findByExamId(examId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuestionDto createQuestion(CreateQuestionRequest request) {
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài thi với ID: " + request.getExamId()));

        Question question = Question.builder()
                .exam(exam)
                .content(request.getContent())
                .score(request.getScore() != null ? request.getScore() : 1.0)
                .build();

        List<Answer> answers = request.getAnswers().stream()
                .map(a -> Answer.builder()
                        .question(question)
                        .content(a.getContent())
                        .isCorrect(a.getIsCorrect() != null && a.getIsCorrect())
                        .build())
                .collect(Collectors.toList());

        question.setAnswers(answers);
        Question savedQuestion = questionRepository.save(question);
        return mapToDto(savedQuestion);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy câu hỏi với ID: " + id);
        }
        questionRepository.deleteById(id);
    }

    private QuestionDto mapToDto(Question question) {
        List<AnswerDto> answers = question.getAnswers().stream()
                .map(a -> AnswerDto.builder()
                        .id(a.getId())
                        .content(a.getContent())
                        .isCorrect(a.getIsCorrect())
                        .build())
                .collect(Collectors.toList());

        return QuestionDto.builder()
                .id(question.getId())
                .examId(question.getExam().getId())
                .content(question.getContent())
                .score(question.getScore())
                .answers(answers)
                .build();
    }
}
