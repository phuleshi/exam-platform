package com.examplatform.exam;

import com.examplatform.classroom.Classroom;
import com.examplatform.classroom.ClassroomRepository;
import com.examplatform.exam.dto.CreateExamRequest;
import com.examplatform.exam.dto.ExamResponse;
import com.examplatform.exam.dto.UpdateExamRequest;
import com.examplatform.exception.ResourceNotFoundException;
import com.examplatform.question.QuestionRepository;
import com.examplatform.submission.SubmissionRepository;
import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ClassroomRepository classroomRepository;
    private final SubmissionRepository submissionRepository;

    public List<ExamResponse> getAllExams() {
        return examRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ExamResponse> getPublishedExams() {
        return examRepository.findByStatus(ExamStatus.PUBLISHED).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ExamResponse> getAvailableExamsForStudent(Long studentId) {
        List<Exam> availableExams = examRepository.findAvailableExamsForStudent(studentId, java.time.LocalDateTime.now());
        Set<Long> completedExamIds = submissionRepository.findByStudentId(studentId).stream()
                .map(s -> s.getExam().getId())
                .collect(Collectors.toSet());

        return availableExams.stream()
                .filter(exam -> !completedExamIds.contains(exam.getId()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ExamResponse> getExamsByTeacher(Long teacherId) {
        return examRepository.findByCreatedById(teacherId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ExamResponse getExamById(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài thi với ID: " + id));
        return mapToResponse(exam);
    }

    @Transactional
    public ExamResponse createExam(CreateExamRequest request, Long teacherId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin giáo viên"));

        Exam exam = Exam.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .passScore(request.getPassScore())
                .status(ExamStatus.DRAFT)
                .createdBy(teacher)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        if (request.getAssignedStudentIds() != null && !request.getAssignedStudentIds().isEmpty()) {
            List<User> students = userRepository.findAllById(request.getAssignedStudentIds());
            exam.setAssignedStudents(new HashSet<>(students));
        }

        if (request.getAssignedClassroomIds() != null && !request.getAssignedClassroomIds().isEmpty()) {
            List<Classroom> classrooms = classroomRepository.findAllById(request.getAssignedClassroomIds());
            exam.setAssignedClasses(new HashSet<>(classrooms));
        }

        Exam savedExam = examRepository.save(exam);
        return mapToResponse(savedExam);
    }

    @Transactional
    public ExamResponse updateExam(Long id, UpdateExamRequest request) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài thi với ID: " + id));

        if (request.getTitle() != null) exam.setTitle(request.getTitle());
        if (request.getDescription() != null) exam.setDescription(request.getDescription());
        if (request.getDurationMinutes() != null) exam.setDurationMinutes(request.getDurationMinutes());
        if (request.getPassScore() != null) exam.setPassScore(request.getPassScore());
        if (request.getStatus() != null) exam.setStatus(request.getStatus());
        if (request.getStartTime() != null) exam.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) exam.setEndTime(request.getEndTime());

        if (request.getAssignedStudentIds() != null) {
            if (request.getAssignedStudentIds().isEmpty()) {
                exam.getAssignedStudents().clear();
            } else {
                List<User> students = userRepository.findAllById(request.getAssignedStudentIds());
                exam.setAssignedStudents(new HashSet<>(students));
            }
        }

        if (request.getAssignedClassroomIds() != null) {
            if (request.getAssignedClassroomIds().isEmpty()) {
                exam.getAssignedClasses().clear();
            } else {
                List<Classroom> classrooms = classroomRepository.findAllById(request.getAssignedClassroomIds());
                exam.setAssignedClasses(new HashSet<>(classrooms));
            }
        }

        Exam updatedExam = examRepository.save(exam);
        return mapToResponse(updatedExam);
    }

    @Transactional
    public void deleteExam(Long id) {
        if (!examRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy bài thi với ID: " + id);
        }
        examRepository.deleteById(id);
    }

    private ExamResponse mapToResponse(Exam exam) {
        int questionCount = questionRepository.countByExamId(exam.getId());
        List<Long> assignedStudentIds = exam.getAssignedStudents() != null
                ? exam.getAssignedStudents().stream().map(User::getId).collect(Collectors.toList())
                : Collections.emptyList();
        List<String> assignedStudentNames = exam.getAssignedStudents() != null
                ? exam.getAssignedStudents().stream().map(User::getFullName).collect(Collectors.toList())
                : Collections.emptyList();

        List<Long> assignedClassroomIds = exam.getAssignedClasses() != null
                ? exam.getAssignedClasses().stream().map(Classroom::getId).collect(Collectors.toList())
                : Collections.emptyList();
        List<String> assignedClassroomNames = exam.getAssignedClasses() != null
                ? exam.getAssignedClasses().stream().map(Classroom::getName).collect(Collectors.toList())
                : Collections.emptyList();

        return ExamResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .durationMinutes(exam.getDurationMinutes())
                .passScore(exam.getPassScore())
                .status(exam.getStatus())
                .createdById(exam.getCreatedBy().getId())
                .createdByName(exam.getCreatedBy().getFullName())
                .totalQuestions(questionCount)
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .assignedStudentIds(assignedStudentIds)
                .assignedStudentNames(assignedStudentNames)
                .assignedClassroomIds(assignedClassroomIds)
                .assignedClassroomNames(assignedClassroomNames)
                .createdAt(exam.getCreatedAt())
                .build();
    }
}
