package com.erp.course.backend.repository;

import com.erp.course.backend.entity.Result;
import com.erp.course.backend.entity.Result.ResultType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    
    // Find results by course
    List<Result> findByCourseIdAndIsActiveTrue(Long courseId);
    
    // Find results by student
    List<Result> findByStudentIdAndIsActiveTrue(Long studentId);
    
    // Find results by instructor
    List<Result> findByInstructorIdAndIsActiveTrue(Long instructorId);
    
    // Find results by course and student
    List<Result> findByCourseIdAndStudentIdAndIsActiveTrue(Long courseId, Long studentId);
    
    // Find results by course and instructor
    List<Result> findByCourseIdAndInstructorIdAndIsActiveTrue(Long courseId, Long instructorId);
    
    // Find released results by student
    List<Result> findByStudentIdAndIsReleasedTrueAndIsActiveTrue(Long studentId);
    
    // Find released results by course and student
    List<Result> findByCourseIdAndStudentIdAndIsReleasedTrueAndIsActiveTrue(Long courseId, Long studentId);
    
    // Find results by course and result type
    List<Result> findByCourseIdAndResultTypeAndIsActiveTrue(Long courseId, ResultType resultType);
    
    // Find results by course, student, and result type
    Optional<Result> findByCourseIdAndStudentIdAndResultTypeAndTitleAndIsActiveTrue(
        Long courseId, Long studentId, ResultType resultType, String title);
    
    // Find unreleased results by course
    List<Result> findByCourseIdAndIsReleasedFalseAndIsActiveTrue(Long courseId);
    
    // Find released results by course
    List<Result> findByCourseIdAndIsReleasedTrueAndIsActiveTrue(Long courseId);
    
    // Count results by course
    Long countByCourseIdAndIsActiveTrue(Long courseId);
    
    // Count released results by course
    Long countByCourseIdAndIsReleasedTrueAndIsActiveTrue(Long courseId);
    
    // Count results by student
    Long countByStudentIdAndIsActiveTrue(Long studentId);
    
    // Count released results by student
    Long countByStudentIdAndIsReleasedTrueAndIsActiveTrue(Long studentId);
    
    // Calculate average result for a student in a course
    @Query("SELECT AVG(r.resultValue) FROM Result r WHERE r.course.id = :courseId AND r.student.id = :studentId AND r.isReleased = true AND r.isActive = true")
    Double getAverageResultForStudentInCourse(@Param("courseId") Long courseId, @Param("studentId") Long studentId);
    
    // Calculate average result for a student across all courses
    @Query("SELECT AVG(r.resultValue) FROM Result r WHERE r.student.id = :studentId AND r.isReleased = true AND r.isActive = true")
    Double getAverageResultForStudent(@Param("studentId") Long studentId);
    
    // Calculate average result for a course
    @Query("SELECT AVG(r.resultValue) FROM Result r WHERE r.course.id = :courseId AND r.isReleased = true AND r.isActive = true")
    Double getAverageResultForCourse(@Param("courseId") Long courseId);
    
    // Get result distribution for a course
    @Query("SELECT r.resultValue, COUNT(r) FROM Result r WHERE r.course.id = :courseId AND r.isReleased = true AND r.isActive = true GROUP BY r.resultValue ORDER BY r.resultValue DESC")
    List<Object[]> getResultDistributionForCourse(@Param("courseId") Long courseId);
    
    // Find students with results in a course
    @Query("SELECT DISTINCT r.student FROM Result r WHERE r.course.id = :courseId AND r.isActive = true")
    List<Object> getStudentsWithResultsInCourse(@Param("courseId") Long courseId);
    
    // Find courses with results for a student
    @Query("SELECT DISTINCT r.course FROM Result r WHERE r.student.id = :studentId AND r.isActive = true")
    List<Object> getCoursesWithResultsForStudent(@Param("studentId") Long studentId);
    
    // Check if a result exists for a specific assessment
    boolean existsByCourseIdAndStudentIdAndResultTypeAndTitleAndIsActiveTrue(
        Long courseId, Long studentId, ResultType resultType, String title);
    
    // Find results by instructor and release status
    List<Result> findByInstructorIdAndIsReleasedAndIsActiveTrue(Long instructorId, Boolean isReleased);
    
    // Find results by course and release status
    List<Result> findByCourseIdAndIsReleasedAndIsActiveTrue(Long courseId, Boolean isReleased);
    
    // Get latest results for a student
    @Query("SELECT r FROM Result r WHERE r.student.id = :studentId AND r.isReleased = true AND r.isActive = true ORDER BY r.createdAt DESC")
    List<Result> getLatestResultsForStudent(@Param("studentId") Long studentId);
    
    // Get latest results for a course
    @Query("SELECT r FROM Result r WHERE r.course.id = :courseId AND r.isActive = true ORDER BY r.createdAt DESC")
    List<Result> getLatestResultsForCourse(@Param("courseId") Long courseId);
    
    // Delete all results for a course (soft delete by setting isActive = false)
    @Query("UPDATE Result r SET r.isActive = false WHERE r.course.id = :courseId")
    void softDeleteResultsByCourse(@Param("courseId") Long courseId);
    
    // Delete all results for a student (soft delete by setting isActive = false)
    @Query("UPDATE Result r SET r.isActive = false WHERE r.student.id = :studentId")
    void softDeleteResultsByStudent(@Param("studentId") Long studentId);
} 