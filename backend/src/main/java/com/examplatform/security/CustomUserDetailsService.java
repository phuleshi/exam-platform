package com.examplatform.security;

import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmailOrStudentId(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email hoặc mã sinh viên: " + username));
        return new CustomUserDetails(user);
    }
}
