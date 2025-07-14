package com.erp.course.backend.controller;

import com.erp.course.backend.dto.*;
import com.erp.course.backend.service.CourseService;
import com.erp.course.backend.service.StudentService;
import com.erp.course.backend.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private ResultService resultService;
    
    // ================================
    // STUDENT PROFILE ENDPOINTS
    // ================================
    
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile() {
        try {
            Long studentId = getCurrentStudentId();
            StudentResponse profile = studentService.getStudentByIdOrThrow(studentId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getMyProfile: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateMyProfile(@Valid @RequestBody StudentRequest request) {
        try {
            Long studentId = getCurrentStudentId();
            StudentResponse updated = studentService.updateStudent(studentId, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // COURSE ENROLLMENT ENDPOINTS
    // ================================
    
    @GetMapping("/courses")
    public ResponseEntity<?> getMyEnrolledCourses() {
        try {
            Long studentId = getCurrentStudentId();
            List<CourseResponse> courses = courseService.getCoursesForStudent(studentId);
            return ResponseEntity.ok(courses);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getMyEnrolledCourses: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/courses/available")
    public ResponseEntity<?> getAvailableCourses() {
        try {
            List<CourseResponse> courses = courseService.getCoursesWithOpenEnrollment();
            return ResponseEntity.ok(courses);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getAvailableCourses: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long courseId) {
        try {
            Long studentId = getCurrentStudentId();
            courseService.enrollStudent(courseId, studentId);
            return ResponseEntity.ok(new MessageResponse("Successfully enrolled in course"));
        } catch (RuntimeException e) {
            System.out.println("❌ Error in enrollInCourse: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/courses/{courseId}/unenroll")
    public ResponseEntity<?> unenrollFromCourse(@PathVariable Long courseId) {
        try {
            Long studentId = getCurrentStudentId();
            courseService.removeStudentFromCourse(courseId, studentId);
            return ResponseEntity.ok(new MessageResponse("Successfully unenrolled from course"));
        } catch (RuntimeException e) {
            System.out.println("❌ Error in unenrollFromCourse: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseResponse> getMyCourseById(@PathVariable Long courseId) {
        try {
            Long studentId = getCurrentStudentId();
            CourseResponse course = courseService.getCourseByIdOrThrow(courseId);
            
            // Verify the student is enrolled in this course
            if (!courseService.isStudentEnrolledInCourse(studentId, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ================================
    // RESULT ENDPOINTS
    // ================================
    
    @GetMapping("/results")
    public ResponseEntity<?> getMyResults() {
        try {
            Long studentId = getCurrentStudentId();
            List<ResultResponse> results = resultService.getReleasedResultsByStudent(studentId);
            return ResponseEntity.ok(results);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getMyResults: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/courses/{courseId}/results")
    public ResponseEntity<?> getMyResultsForCourse(@PathVariable Long courseId) {
        try {
            Long studentId = getCurrentStudentId();
            List<ResultResponse> results = resultService.getReleasedResultsByCourseAndStudent(courseId, studentId);
            return ResponseEntity.ok(results);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getMyResultsForCourse: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/results/average")
    public ResponseEntity<?> getMyAverageResult() {
        try {
            Long studentId = getCurrentStudentId();
            Double average = resultService.getAverageResultForStudent(studentId);
            Map<String, Object> response = new HashMap<>();
            response.put("averageResult", average);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getMyAverageResult: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/courses/{courseId}/results/average")
    public ResponseEntity<?> getMyAverageResultForCourse(@PathVariable Long courseId) {
        try {
            Long studentId = getCurrentStudentId();
            Double average = resultService.getAverageResultForStudentInCourse(courseId, studentId);
            Map<String, Object> response = new HashMap<>();
            response.put("courseId", courseId);
            response.put("studentId", studentId);
            response.put("averageResult", average);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getMyAverageResultForCourse: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // STATISTICS ENDPOINTS
    // ================================
    
    @GetMapping("/statistics")
    public ResponseEntity<?> getMyStatistics() {
        try {
            Long studentId = getCurrentStudentId();
            StudentResponse profile = studentService.getStudentByIdOrThrow(studentId);
            List<CourseResponse> enrolledCourses = courseService.getCoursesForStudent(studentId);
            List<ResultResponse> results = resultService.getReleasedResultsByStudent(studentId);
            Double averageResult = resultService.getAverageResultForStudent(studentId);
            
            Map<String, Object> statistics = new HashMap<>();
            
            // Student profile info
            statistics.put("studentId", profile.getStudentId());
            statistics.put("fullName", profile.getFullName());
            statistics.put("major", profile.getMajor());
            statistics.put("year", profile.getYear());
            statistics.put("gpa", profile.getGpa());
            statistics.put("status", profile.getStatus());
            
            // Course statistics
            statistics.put("totalEnrolledCourses", enrolledCourses.size());
            statistics.put("enrolledCourses", enrolledCourses);
            
            // Academic performance
            statistics.put("totalResults", results.size());
            statistics.put("averageResult", averageResult != null ? averageResult : 0.0);
            
            // Progress tracking
            statistics.put("enrollmentDate", profile.getEnrollmentDate());
            statistics.put("graduationDate", profile.getGraduationDate());
            statistics.put("currentSemester", getCurrentSemester());
            
            return ResponseEntity.ok(statistics);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getMyStatistics: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // UTILITY METHODS
    // ================================
    
    private String getCurrentSemester() {
        // Simple semester calculation based on current date
        java.time.LocalDate now = java.time.LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();
        
        if (month >= 1 && month <= 5) {
            return "Spring " + year;
        } else if (month >= 6 && month <= 8) {
            return "Summer " + year;
        } else {
            return "Fall " + year;
        }
    }
    
    private Long getCurrentStudentId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new RuntimeException("No authentication found");
        }
        
        String username = authentication.getName();
        if (username == null || username.isEmpty()) {
            throw new RuntimeException("No username found in authentication");
        }
        
        System.out.println("🔍 Looking for user with username: " + username);
        
        // Get the User entity from the authentication principal
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof com.erp.course.backend.entity.User)) {
            throw new RuntimeException("Invalid authentication principal type");
        }
        
        com.erp.course.backend.entity.User user = (com.erp.course.backend.entity.User) principal;
        String email = user.getEmail();
        
        System.out.println("🔍 Looking for student with email: " + email);
        
        try {
            StudentResponse student = studentService.getStudentByEmail(email);
            System.out.println("✅ Found student: " + student.getId() + " - " + student.getFirstName() + " " + student.getLastName());
            return student.getId();
        } catch (RuntimeException e) {
            System.out.println("❌ Failed to find student with email: " + email + " - Error: " + e.getMessage());
            throw new RuntimeException("Student not found with email: " + email + ". Please contact admin to create student profile.");
        }
    }
} 