package com.examplatform.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByStatus(ExamStatus status);
    List<Exam> findByCreatedById(Long createdById);

    @Query("SELECT DISTINCT e FROM Exam e " +
           "LEFT JOIN e.assignedStudents s " +
           "LEFT JOIN e.assignedClasses c " +
           "LEFT JOIN c.students cs " +
           "WHERE e.status = 'PUBLISHED' " +
           "AND (e.startTime IS NULL OR e.startTime <= :now) " +
           "AND (e.endTime IS NULL OR e.endTime > :now) " +
           "AND (" +
           "  (SIZE(e.assignedStudents) = 0 AND SIZE(e.assignedClasses) = 0) " +
           "  OR s.id = :studentId " +
           "  OR cs.id = :studentId" +
           ")")
    List<Exam> findAvailableExamsForStudent(@Param("studentId") Long studentId, @Param("now") LocalDateTime now);
}
