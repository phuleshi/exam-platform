package com.examplatform.auth;

import com.examplatform.auth.dto.LoginRequest;
import com.examplatform.auth.dto.LoginResponse;
import com.examplatform.auth.dto.RegisterRequest;
import com.examplatform.common.ApiResponse;
import com.examplatform.exam.ExamService;
import com.examplatform.exam.dto.ExamResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final ExamService examService;

    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<String>> ping() {
        return ResponseEntity.ok(ApiResponse.success("Backend is UP!", "PONG"));
    }

    @GetMapping("/test-heavy")
    public ResponseEntity<ApiResponse<List<ExamResponse>>> testHeavy(
            @RequestParam(required = false, defaultValue = "false") boolean simulateCpu
    ) {
        // 1. Thực hiện Query Database thực tế (Truy vấn danh sách bài thi + đếm câu hỏi)
        List<ExamResponse> exams = examService.getAllExams();
        
        // 2. Giả lập tính toán nặng (nếu cần đẩy CPU nhanh hơn)
        if (simulateCpu) {
            double dummy = 0;
            for (int i = 0; i < 50000; i++) {
                dummy += Math.sin(i) * Math.cos(i);
            }
        }
        
        return ResponseEntity.ok(ApiResponse.success("Fetched exams with DB I/O", exams));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký tài khoản thành công", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", response));
    }
}
