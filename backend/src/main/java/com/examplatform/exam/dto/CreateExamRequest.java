package com.examplatform.exam.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateExamRequest {
    @NotBlank(message = "Tên bài thi không được để trống")
    private String title;

    private String description;

    @NotNull(message = "Thời gian làm bài không được để trống")
    @Min(value = 1, message = "Thời gian phải lớn hơn 0 phút")
    private Integer durationMinutes;

    @NotNull(message = "Điểm đạt không được để trống")
    private Double passScore;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private java.util.List<Long> assignedStudentIds;
    private java.util.List<Long> assignedClassroomIds;
}
