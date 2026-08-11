package com.examplatform.result;

import com.examplatform.common.ApiResponse;
import com.examplatform.result.dto.ResultDto;
import com.examplatform.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @GetMapping("/my-results")
    public ResponseEntity<ApiResponse<List<ResultDto>>> getMyResults(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<ResultDto> results = resultService.getResultsByStudent(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<ResultDto>>> getResultsByExam(@PathVariable Long examId) {
        List<ResultDto> results = resultService.getResultsByExam(examId);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResultDto>> getResultById(@PathVariable Long id) {
        ResultDto result = resultService.getResultById(id);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
