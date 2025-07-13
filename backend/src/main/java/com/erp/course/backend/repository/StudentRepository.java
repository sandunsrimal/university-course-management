package com.erp.course.backend.repository;

import com.erp.course.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByStudentId(String studentId);
    
    Optional<Student> findByEmail(String email);
    
    boolean existsByStudentId(String studentId);
    
    boolean existsByEmail(String email);
    
    List<Student> findByIsActiveTrue();
    
    List<Student> findByIsActiveFalse();
    
    List<Student> findByMajor(String major);
    
    List<Student> findByYear(Integer year);
    
    List<Student> findByStatus(String status);
    
    List<Student> findByMajorAndYear(String major, Integer year);
    
    List<Student> findByMajorAndIsActiveTrue(String major);
    
    List<Student> findByYearAndIsActiveTrue(Integer year);
    
    List<Student> findByStatusAndIsActiveTrue(String status);
    
    @Query("SELECT s FROM Student s WHERE s.firstName LIKE %:name% OR s.lastName LIKE %:name%")
    List<Student> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT s FROM Student s WHERE s.isActive = true AND (s.firstName LIKE %:name% OR s.lastName LIKE %:name%)")
    List<Student> findActiveStudentsByNameContaining(@Param("name") String name);
    
    @Query("SELECT DISTINCT s.major FROM Student s WHERE s.isActive = true")
    List<String> findAllActiveMajors();
    
    @Query("SELECT DISTINCT s.status FROM Student s WHERE s.isActive = true")
    List<String> findAllActiveStatuses();
    
    @Query("SELECT COUNT(s) FROM Student s WHERE s.isActive = true")
    long countActiveStudents();
    
    @Query("SELECT COUNT(s) FROM Student s WHERE s.major = :major AND s.isActive = true")
    long countByMajorAndActive(@Param("major") String major);
    
    @Query("SELECT COUNT(s) FROM Student s WHERE s.year = :year AND s.isActive = true")
    long countByYearAndActive(@Param("year") Integer year);
    
    @Query("SELECT COUNT(s) FROM Student s WHERE s.status = :status AND s.isActive = true")
    long countByStatusAndActive(@Param("status") String status);
    
    @Query("SELECT AVG(s.gpa) FROM Student s WHERE s.isActive = true AND s.gpa IS NOT NULL")
    Double findAverageGpa();
    
    @Query("SELECT AVG(s.gpa) FROM Student s WHERE s.major = :major AND s.isActive = true AND s.gpa IS NOT NULL")
    Double findAverageGpaByMajor(@Param("major") String major);
} 