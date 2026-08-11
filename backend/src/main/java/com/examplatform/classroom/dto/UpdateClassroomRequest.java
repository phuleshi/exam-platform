package com.examplatform.classroom.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class UpdateClassroomRequest {
    @NotBlank(message = "Tên lớp học không được để trống")
    private String name;

    @NotBlank(message = "Mã lớp học không được để trống")
    private String code;

    private String description;

    private Long teacherId;

    private List<Long> studentIds;
}
