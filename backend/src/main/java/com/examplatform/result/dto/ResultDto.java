package com.examplatform.result.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultDto {
    private Long id;
    private Long submissionId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long examId;
    private String examTitle;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double score;
    private Double passScore;
    private Boolean isPassed;
    private LocalDateTime createdAt;
}
