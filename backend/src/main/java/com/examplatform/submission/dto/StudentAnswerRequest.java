package com.examplatform.submission.dto;

import lombok.Data;

@Data
public class StudentAnswerRequest {
    private Long questionId;
    private Long selectedAnswerId;
}
