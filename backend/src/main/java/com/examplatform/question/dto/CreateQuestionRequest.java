package com.examplatform.question.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateQuestionRequest {
    @NotNull(message = "ID bài thi không được để trống")
    private Long examId;

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    private String content;

    private Double score = 1.0;

    @NotEmpty(message = "Câu hỏi phải có ít nhất một lựa chọn trả lời")
    private List<AnswerDto> answers;
}
