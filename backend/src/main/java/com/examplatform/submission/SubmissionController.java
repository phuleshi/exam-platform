package com.examplatform.submission;

import com.examplatform.common.ApiResponse;
import com.examplatform.result.dto.ResultDto;
import com.examplatform.security.CustomUserDetails;
import com.examplatform.submission.dto.SubmitExamRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ResultDto>> submitExam(
            @Valid @RequestBody SubmitExamRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        ResultDto result = submissionService.submitExam(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Nộp bài thi thành công", result));
    }
}
