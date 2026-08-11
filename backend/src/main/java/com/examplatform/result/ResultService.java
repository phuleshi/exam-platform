package com.examplatform.result;

import com.examplatform.exception.ResourceNotFoundException;
import com.examplatform.result.dto.ResultDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;

    public List<ResultDto> getResultsByStudent(Long studentId) {
        return resultRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ResultDto> getResultsByExam(Long examId) {
        return resultRepository.findByExamId(examId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ResultDto getResultById(Long id) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kết quả bài thi"));
        return mapToDto(result);
    }

    public ResultDto getResultBySubmission(Long submissionId) {
        Result result = resultRepository.findBySubmissionId(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kết quả bài nộp"));
        return mapToDto(result);
    }

    private ResultDto mapToDto(Result result) {
        return ResultDto.builder()
                .id(result.getId())
                .submissionId(result.getSubmission().getId())
                .studentId(result.getStudent().getId())
                .studentName(result.getStudent().getFullName())
                .studentEmail(result.getStudent().getEmail())
                .examId(result.getExam().getId())
                .examTitle(result.getExam().getTitle())
                .totalQuestions(result.getTotalQuestions())
                .correctAnswers(result.getCorrectAnswers())
                .score(result.getScore())
                .passScore(result.getExam().getPassScore())
                .isPassed(result.getIsPassed())
                .createdAt(result.getCreatedAt())
                .build();
    }
}
