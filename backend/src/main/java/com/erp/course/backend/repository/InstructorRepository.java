package com.erp.course.backend.repository;

import com.erp.course.backend.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface InstructorRepository extends JpaRepository<Instructor, Long> {
    
    Optional<Instructor> findByEmployeeId(String employeeId);
    
    Optional<Instructor> findByEmail(String email);
    
    boolean existsByEmployeeId(String employeeId);
    
    boolean existsByEmail(String email);
    
    List<Instructor> findByIsActiveTrue();
    
    List<Instructor> findByIsActiveFalse();
    
    List<Instructor> findByDepartment(String department);
    
    List<Instructor> findBySpecialization(String specialization);
    
    List<Instructor> findByDepartmentAndIsActiveTrue(String department);
    
    @Query("SELECT i FROM Instructor i WHERE i.firstName LIKE %:name% OR i.lastName LIKE %:name%")
    List<Instructor> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT i FROM Instructor i WHERE i.isActive = true AND (i.firstName LIKE %:name% OR i.lastName LIKE %:name%)")
    List<Instructor> findActiveInstructorsByNameContaining(@Param("name") String name);
    
    @Query("SELECT DISTINCT i.department FROM Instructor i WHERE i.isActive = true")
    List<String> findAllActiveDepartments();
    
    @Query("SELECT DISTINCT i.specialization FROM Instructor i WHERE i.isActive = true AND i.specialization IS NOT NULL")
    List<String> findAllActiveSpecializations();
    
    @Query("SELECT COUNT(i) FROM Instructor i WHERE i.isActive = true")
    long countActiveInstructors();
    
    @Query("SELECT COUNT(i) FROM Instructor i WHERE i.department = :department AND i.isActive = true")
    long countByDepartmentAndActive(@Param("department") String department);
} 