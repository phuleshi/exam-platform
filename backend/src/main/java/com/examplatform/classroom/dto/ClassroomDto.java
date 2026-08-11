package com.examplatform.classroom.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomDto {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Long teacherId;
    private String teacherName;
    private List<Long> studentIds;
    private List<String> studentNames;
    private int studentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
