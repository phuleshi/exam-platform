package com.examplatform.auth.dto;

import com.examplatform.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long id;
    private String fullName;
    private String email;
    private String studentId;
    private Role role;
}
