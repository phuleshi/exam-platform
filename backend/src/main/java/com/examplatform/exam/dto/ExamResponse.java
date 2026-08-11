package com.examplatform.exam.dto;

import com.examplatform.exam.ExamStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResponse {
    private Long id;
    private String title;
    private String description;
    private Integer durationMinutes;
    private Double passScore;
    private ExamStatus status;
    private Long createdById;
    private String createdByName;
    private Integer totalQuestions;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private java.util.List<Long> assignedStudentIds;
    private java.util.List<String> assignedStudentNames;
    private java.util.List<Long> assignedClassroomIds;
    private java.util.List<String> assignedClassroomNames;
    private LocalDateTime createdAt;
}
