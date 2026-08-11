package com.examplatform.question;

import com.examplatform.common.ApiResponse;
import com.examplatform.question.dto.CreateQuestionRequest;
import com.examplatform.question.dto.QuestionDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/exam/{examId}")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> getQuestionsByExamId(@PathVariable Long examId) {
        return ResponseEntity.ok(ApiResponse.success(questionService.getQuestionsByExamId(examId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<QuestionDto>> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        QuestionDto created = questionService.createQuestion(request);
        return ResponseEntity.ok(ApiResponse.success("Thêm câu hỏi thành công", created));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa câu hỏi thành công", null));
    }
}
