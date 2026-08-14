package com.examplatform.classroom;

import com.examplatform.classroom.dto.ClassroomDto;
import com.examplatform.classroom.dto.CreateClassroomRequest;
import com.examplatform.classroom.dto.UpdateClassroomRequest;
import com.examplatform.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classrooms")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomService classroomService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ClassroomDto>> createClassroom(
            @Valid @RequestBody CreateClassroomRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ClassroomDto classroom = classroomService.createClassroom(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Tạo lớp học thành công", classroom));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ClassroomDto>>> getAllClassrooms() {
        List<ClassroomDto> classrooms = classroomService.getAllClassrooms();
        return ResponseEntity.ok(ApiResponse.success("Lấy tất cả danh sách lớp học thành công", classrooms));
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ClassroomDto>>> getTeacherClassrooms(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ClassroomDto> classrooms = classroomService.getTeacherClassrooms(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp học do giáo viên quản lý thành công", classrooms));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ClassroomDto>>> getStudentClassrooms(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ClassroomDto> classrooms = classroomService.getStudentClassrooms(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp học của học sinh thành công", classrooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassroomDto>> getClassroomById(@PathVariable Long id) {
        ClassroomDto classroom = classroomService.getClassroomById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin lớp học thành công", classroom));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ClassroomDto>> updateClassroom(
            @PathVariable Long id,
            @Valid @RequestBody UpdateClassroomRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ClassroomDto classroom = classroomService.updateClassroom(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lớp học thành công", classroom));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteClassroom(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        classroomService.deleteClassroom(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Xóa lớp học thành công", null));
    }
}
