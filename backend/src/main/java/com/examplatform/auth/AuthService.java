package com.examplatform.auth;

import com.examplatform.auth.dto.LoginRequest;
import com.examplatform.auth.dto.LoginResponse;
import com.examplatform.auth.dto.RegisterRequest;
import com.examplatform.exception.BadRequestException;
import com.examplatform.security.CustomUserDetails;
import com.examplatform.security.JwtService;
import com.examplatform.user.Role;
import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng!");
        }
        if (request.getStudentId() != null && !request.getStudentId().trim().isEmpty() && userRepository.existsByStudentId(request.getStudentId())) {
            throw new BadRequestException("Mã sinh viên đã tồn tại!");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .studentId(request.getStudentId() != null && !request.getStudentId().trim().isEmpty() ? request.getStudentId().trim() : null)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                .build();

        userRepository.save(user);
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentId(user.getStudentId())
                .role(user.getRole())
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmailOrStudentId(request.getEmail(), request.getEmail())
                .orElseThrow(() -> new BadRequestException("Người dùng không tồn tại"));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentId(user.getStudentId())
                .role(user.getRole())
                .build();
    }
}
