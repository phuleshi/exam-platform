package com.examplatform.exam;

import com.examplatform.common.ApiResponse;
import com.examplatform.exam.dto.CreateExamRequest;
import com.examplatform.exam.dto.ExamResponse;
import com.examplatform.exam.dto.UpdateExamRequest;
import com.examplatform.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getExams(
            @RequestParam(required = false) String status
    ) {
        if ("PUBLISHED".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(ApiResponse.success(examService.getPublishedExams()));
        }
        return ResponseEntity.ok(ApiResponse.success(examService.getAllExams()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExamResponse>> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(examService.getExamById(id)));
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getTeacherExams(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(examService.getExamsByTeacher(userDetails.getId())));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getStudentExams(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(examService.getAvailableExamsForStudent(userDetails.getId())));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<ExamResponse>> createExam(
            @Valid @RequestBody CreateExamRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        ExamResponse created = examService.createExam(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Tạo bài thi thành công", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<ExamResponse>> updateExam(
            @PathVariable Long id,
            @RequestBody UpdateExamRequest request
    ) {
        ExamResponse updated = examService.updateExam(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật bài thi thành công", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Void>> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa bài thi thành công", null));
    }
}
