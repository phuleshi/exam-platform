package com.examplatform.exam.dto;

import com.examplatform.exam.ExamStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateExamRequest {
    private String title;
    private String description;
    private Integer durationMinutes;
    private Double passScore;
    private ExamStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private java.util.List<Long> assignedStudentIds;
    private java.util.List<Long> assignedClassroomIds;
}
