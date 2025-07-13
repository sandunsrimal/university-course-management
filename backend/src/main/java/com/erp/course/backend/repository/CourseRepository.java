package com.erp.course.backend.repository;

import com.erp.course.backend.entity.Course;
import com.erp.course.backend.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    // Find by course code
    Optional<Course> findByCourseCode(String courseCode);
    
    // Find by course code and active status
    Optional<Course> findByCourseCodeAndIsActive(String courseCode, Boolean isActive);
    
    // Find all active courses
    List<Course> findByIsActiveTrue();
    
    // Find all courses by department
    List<Course> findByDepartment(String department);
    
    // Find active courses by department
    List<Course> findByDepartmentAndIsActiveTrue(String department);
    
    // Find courses by semester
    List<Course> findBySemester(Integer semester);
    
    // Find active courses by semester
    List<Course> findBySemesterAndIsActiveTrue(Integer semester);
    
    // Find courses by instructor
    List<Course> findByInstructor(Instructor instructor);
    
    // Find active courses by instructor
    List<Course> findByInstructorAndIsActiveTrue(Instructor instructor);
    
    // Find courses by instructor ID
    List<Course> findByInstructorId(Long instructorId);
    
    // Find active courses by instructor ID
    List<Course> findByInstructorIdAndIsActiveTrue(Long instructorId);
    
    // Find courses with open enrollment
    List<Course> findByEnrollmentOpenTrueAndIsActiveTrue();
    
    // Find courses by department and semester
    List<Course> findByDepartmentAndSemester(String department, Integer semester);
    
    // Find active courses by department and semester
    List<Course> findByDepartmentAndSemesterAndIsActiveTrue(String department, Integer semester);
    
    // Search courses by name or code
    @Query("SELECT c FROM Course c WHERE " +
           "(LOWER(c.courseName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.courseCode) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "c.isActive = true")
    List<Course> searchCoursesByNameOrCode(@Param("searchTerm") String searchTerm);
    
    // Search all courses by name or code (including inactive)
    @Query("SELECT c FROM Course c WHERE " +
           "LOWER(c.courseName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.courseCode) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Course> searchAllCoursesByNameOrCode(@Param("searchTerm") String searchTerm);
    
    // Find courses with available spots
    @Query("SELECT c FROM Course c WHERE " +
           "c.currentEnrollment < c.maxCapacity AND " +
           "c.enrollmentOpen = true AND " +
           "c.isActive = true")
    List<Course> findCoursesWithAvailableSpots();
    
    // Find full courses
    @Query("SELECT c FROM Course c WHERE " +
           "c.currentEnrollment >= c.maxCapacity AND " +
           "c.isActive = true")
    List<Course> findFullCourses();
    
    // Get distinct departments
    @Query("SELECT DISTINCT c.department FROM Course c WHERE c.isActive = true")
    List<String> findDistinctDepartments();
    
    // Get distinct semesters
    @Query("SELECT DISTINCT c.semester FROM Course c WHERE c.isActive = true ORDER BY c.semester")
    List<Integer> findDistinctSemesters();
    
    // Count courses by department
    @Query("SELECT COUNT(c) FROM Course c WHERE c.department = :department AND c.isActive = true")
    Long countCoursesByDepartment(@Param("department") String department);
    
    // Count courses by semester
    @Query("SELECT COUNT(c) FROM Course c WHERE c.semester = :semester AND c.isActive = true")
    Long countCoursesBySemester(@Param("semester") Integer semester);
    
    // Count courses by instructor
    @Query("SELECT COUNT(c) FROM Course c WHERE c.instructor.id = :instructorId AND c.isActive = true")
    Long countCoursesByInstructor(@Param("instructorId") Long instructorId);
    
    // Get total enrollment across all courses
    @Query("SELECT SUM(c.currentEnrollment) FROM Course c WHERE c.isActive = true")
    Long getTotalEnrollment();
    
    // Get total capacity across all courses
    @Query("SELECT SUM(c.maxCapacity) FROM Course c WHERE c.isActive = true")
    Long getTotalCapacity();
    
    // Find courses by enrollment status
    @Query("SELECT c FROM Course c WHERE " +
           "c.isActive = true AND " +
           "(:enrollmentStatus = 'OPEN' AND c.enrollmentOpen = true) OR " +
           "(:enrollmentStatus = 'CLOSED' AND c.enrollmentOpen = false) OR " +
           "(:enrollmentStatus = 'FULL' AND c.currentEnrollment >= c.maxCapacity)")
    List<Course> findCoursesByEnrollmentStatus(@Param("enrollmentStatus") String enrollmentStatus);
    
    // Check if course exists by code (excluding specific id for updates)
    @Query("SELECT COUNT(c) > 0 FROM Course c WHERE c.courseCode = :courseCode AND c.id != :excludeId")
    boolean existsByCourseCodeAndIdNot(@Param("courseCode") String courseCode, @Param("excludeId") Long excludeId);
    
    // Check if course exists by code
    boolean existsByCourseCode(String courseCode);
    
    // Count active courses
    Long countByIsActiveTrue();
    
    // Find courses that a specific student is enrolled in
    @Query("SELECT c FROM Course c JOIN c.enrolledStudents s WHERE s.id = :studentId AND c.isActive = true")
    List<Course> findCoursesByEnrolledStudent(@Param("studentId") Long studentId);
    
    // Find courses that a specific student is NOT enrolled in
    @Query("SELECT c FROM Course c WHERE c.isActive = true AND c.enrollmentOpen = true AND " +
           "c.currentEnrollment < c.maxCapacity AND " +
           "c.id NOT IN (SELECT c2.id FROM Course c2 JOIN c2.enrolledStudents s WHERE s.id = :studentId)")
    List<Course> findAvailableCoursesForStudent(@Param("studentId") Long studentId);
    
    // Count active courses by instructor
    Long countByInstructorIdAndIsActiveTrue(Long instructorId);
    
    // Get total student count by instructor
    @Query("SELECT SUM(c.currentEnrollment) FROM Course c WHERE c.instructor.id = :instructorId AND c.isActive = true")
    Long getTotalStudentCountByInstructor(@Param("instructorId") Long instructorId);
    
    // Get average enrollment by instructor
    @Query("SELECT AVG(c.currentEnrollment) FROM Course c WHERE c.instructor.id = :instructorId AND c.isActive = true")
    Double getAverageEnrollmentByInstructor(@Param("instructorId") Long instructorId);
} 