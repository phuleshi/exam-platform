package com.examplatform.config;

import com.examplatform.user.Role;
import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createOrResetUser("admin@exam.com", "Quản Trị Viên", "123456", Role.ADMIN, null);
        createOrResetUser("teacher@exam.com", "Giáo Viên Mẫu", "123456", Role.TEACHER, null);
        createOrResetUser("11210001@st.neu.edu.vn", "Sinh Viên NEU", "123456", Role.STUDENT, "11210001");
    }

    private void createOrResetUser(String email, String fullName, String rawPassword, Role role, String studentId) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = User.builder()
                    .email(email)
                    .fullName(fullName)
                    .studentId(studentId)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .build();
            userRepository.save(user);
            log.info("Initialized demo user {} with password {}", email, rawPassword);
        } else {
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            if (studentId != null) {
                user.setStudentId(studentId);
            }
            userRepository.save(user);
            log.info("Reset password for demo user {} to {}", email, rawPassword);
        }
    }
}
