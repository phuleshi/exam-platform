package com.examplatform.classroom;

import com.examplatform.classroom.dto.ClassroomDto;
import com.examplatform.classroom.dto.CreateClassroomRequest;
import com.examplatform.classroom.dto.UpdateClassroomRequest;
import com.examplatform.user.Role;
import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;

    @Transactional
    public ClassroomDto createClassroom(CreateClassroomRequest request, String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        User teacher = currentUser;
        if (request.getTeacherId() != null) {
            teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Giáo viên không tồn tại"));
        }

        if (classroomRepository.findByCode(request.getCode()).isPresent()) {
            throw new RuntimeException("Mã lớp học đã tồn tại");
        }

        Classroom classroom = Classroom.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .teacher(teacher)
                .students(new HashSet<>())
                .build();

        if (request.getStudentIds() != null && !request.getStudentIds().isEmpty()) {
            List<User> students = userRepository.findAllById(request.getStudentIds());
            classroom.setStudents(new HashSet<>(students));
        }

        Classroom saved = classroomRepository.save(classroom);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ClassroomDto> getAllClassrooms() {
        return classroomRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClassroomDto> getTeacherClassrooms(String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new RuntimeException("Giáo viên không tồn tại"));
        return classroomRepository.findByTeacherId(teacher.getId())
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClassroomDto> getStudentClassrooms(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Học sinh không tồn tại"));
        return classroomRepository.findByStudentId(student.getId())
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClassroomDto getClassroomById(Long id) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        return mapToDto(classroom);
    }

    @Transactional
    public ClassroomDto updateClassroom(Long id, UpdateClassroomRequest request, String currentUserEmail) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isAssignedTeacher = classroom.getTeacher().getId().equals(currentUser.getId());

        if (!isAdmin && !isAssignedTeacher) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa lớp học này");
        }

        if (!classroom.getCode().equals(request.getCode()) && classroomRepository.findByCode(request.getCode()).isPresent()) {
            throw new RuntimeException("Mã lớp học đã tồn tại");
        }

        classroom.setName(request.getName());
        classroom.setCode(request.getCode());
        classroom.setDescription(request.getDescription());

        if (request.getTeacherId() != null) {
            User newTeacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Giáo viên không tồn tại"));
            classroom.setTeacher(newTeacher);
        }

        if (request.getStudentIds() != null) {
            List<User> students = userRepository.findAllById(request.getStudentIds());
            classroom.setStudents(new HashSet<>(students));
        } else {
            classroom.getStudents().clear();
        }

        Classroom saved = classroomRepository.save(classroom);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteClassroom(Long id, String currentUserEmail) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isAssignedTeacher = classroom.getTeacher().getId().equals(currentUser.getId());

        if (!isAdmin && !isAssignedTeacher) {
            throw new RuntimeException("Bạn không có quyền xóa lớp học này");
        }

        classroomRepository.delete(classroom);
    }

    private ClassroomDto mapToDto(Classroom classroom) {
        List<Long> studentIds = classroom.getStudents().stream().map(User::getId).toList();
        List<String> studentNames = classroom.getStudents().stream().map(User::getFullName).toList();

        return ClassroomDto.builder()
                .id(classroom.getId())
                .name(classroom.getName())
                .code(classroom.getCode())
                .description(classroom.getDescription())
                .teacherId(classroom.getTeacher().getId())
                .teacherName(classroom.getTeacher().getFullName())
                .studentIds(studentIds)
                .studentNames(studentNames)
                .studentCount(classroom.getStudents().size())
                .createdAt(classroom.getCreatedAt())
                .updatedAt(classroom.getUpdatedAt())
                .build();
    }
}
