package com.examplatform.submission.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SubmitExamRequest {
    @NotNull(message = "ID bài thi không được để trống")
    private Long examId;
    private List<StudentAnswerRequest> answers;
}
