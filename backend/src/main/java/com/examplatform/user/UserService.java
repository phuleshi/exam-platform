package com.examplatform.user;

import com.examplatform.exception.BadRequestException;
import com.examplatform.exception.ResourceNotFoundException;
import com.examplatform.user.dto.ChangePasswordRequest;
import com.examplatform.user.dto.CreateStudentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User createStudent(CreateStudentRequest request) {
        if (request == null) {
            throw new BadRequestException("Dữ liệu tạo sinh viên không hợp lệ!");
        }
        if (request.getStudentId() == null || request.getStudentId().trim().isEmpty()) {
            throw new BadRequestException("Mã sinh viên không được để trống!");
        }
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new BadRequestException("Họ tên sinh viên không được để trống!");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email không được để trống!");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BadRequestException("Mật khẩu không được để trống!");
        }

        String studentId = request.getStudentId().trim();
        String email = request.getEmail().trim();
        String fullName = request.getFullName().trim();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email " + email + " đã được sử dụng!");
        }

        if (userRepository.existsByStudentId(studentId)) {
            throw new BadRequestException("Mã sinh viên " + studentId + " đã tồn tại trong hệ thống!");
        }

        User student = User.builder()
                .studentId(studentId)
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();

        return userRepository.save(student);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = getUserById(userId);

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Mật khẩu hiện tại không chính xác!");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
