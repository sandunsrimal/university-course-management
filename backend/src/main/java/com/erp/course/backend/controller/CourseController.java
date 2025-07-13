package com.erp.course.backend.controller;

import com.erp.course.backend.dto.*;
import com.erp.course.backend.service.CourseService;
import com.erp.course.backend.service.StudentService;
import com.erp.course.backend.entity.User;
import com.erp.course.backend.entity.Student;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private StudentService studentService;
    
    // ================================
    // ADMIN COURSE MANAGEMENT
    // ================================
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<CourseResponse>> getActiveCourses() {
        List<CourseResponse> courses = courseService.getAllActiveCourses();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(course -> ResponseEntity.ok(course))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{courseCode}")
    public ResponseEntity<CourseResponse> getCourseByCourseCode(@PathVariable String courseCode) {
        return courseService.getCourseByCourseCode(courseCode)
                .map(course -> ResponseEntity.ok(course))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseRequest request) {
        try {
            CourseResponse course = courseService.createCourse(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        try {
            CourseResponse course = courseService.updateCourse(id, request);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(new MessageResponse("Course deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}/permanent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> permanentDeleteCourse(@PathVariable Long id) {
        try {
            courseService.permanentDeleteCourse(id);
            return ResponseEntity.ok(new MessageResponse("Course permanently deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateCourse(@PathVariable Long id) {
        try {
            CourseResponse course = courseService.activateCourse(id);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // SEARCH AND FILTER OPERATIONS
    // ================================
    
    @GetMapping("/department/{department}")
    public ResponseEntity<List<CourseResponse>> getCoursesByDepartment(@PathVariable String department) {
        List<CourseResponse> courses = courseService.getCoursesByDepartment(department);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/semester/{semester}")
    public ResponseEntity<List<CourseResponse>> getCoursesBySemester(@PathVariable Integer semester) {
        List<CourseResponse> courses = courseService.getCoursesBySemester(semester);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<CourseResponse>> getCoursesByInstructor(@PathVariable Long instructorId) {
        List<CourseResponse> courses = courseService.getCoursesByInstructor(instructorId);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<CourseResponse>> searchCourses(@RequestParam String query) {
        List<CourseResponse> courses = courseService.searchCoursesByNameOrCode(query);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<CourseResponse>> getCoursesWithAvailableSpots() {
        List<CourseResponse> courses = courseService.getCoursesWithAvailableSpots();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/enrollment-open")
    public ResponseEntity<List<CourseResponse>> getCoursesWithOpenEnrollment() {
        List<CourseResponse> courses = courseService.getCoursesWithOpenEnrollment();
        return ResponseEntity.ok(courses);
    }
    
    // ================================
    // ENROLLMENT MANAGEMENT (ADMIN)
    // ================================
    
    @PostMapping("/{courseId}/enroll/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> enrollStudentInCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            CourseResponse course = courseService.enrollStudent(courseId, studentId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{courseId}/enroll/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeStudentFromCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            CourseResponse course = courseService.removeStudentFromCourse(courseId, studentId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{courseId}/enrollment/open")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> openEnrollment(@PathVariable Long courseId) {
        try {
            CourseResponse course = courseService.openEnrollment(courseId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{courseId}/enrollment/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> closeEnrollment(@PathVariable Long courseId) {
        try {
            CourseResponse course = courseService.closeEnrollment(courseId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // STUDENT ENROLLMENT (SELF-ENROLLMENT)
    // ================================
    
    @PostMapping("/{courseId}/self-enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> selfEnrollInCourse(@PathVariable Long courseId) {
        try {
            // Get student ID from security context - this would need to be implemented
            // For now, assuming we get it from the request or session
            // TODO: Implement proper student ID retrieval from security context
            Long studentId = getCurrentStudentId();
            
            CourseResponse course = courseService.enrollStudent(courseId, studentId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{courseId}/self-enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> selfUnenrollFromCourse(@PathVariable Long courseId) {
        try {
            // Get student ID from security context
            Long studentId = getCurrentStudentId();
            
            CourseResponse course = courseService.removeStudentFromCourse(courseId, studentId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CourseResponse>> getCoursesForStudent(@PathVariable Long studentId) {
        List<CourseResponse> courses = courseService.getCoursesForStudent(studentId);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/student/{studentId}/available")
    public ResponseEntity<List<CourseResponse>> getAvailableCoursesForStudent(@PathVariable Long studentId) {
        List<CourseResponse> courses = courseService.getAvailableCoursesForStudent(studentId);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyCourses() {
        try {
            Long studentId = getCurrentStudentId();
            List<CourseResponse> courses = courseService.getCoursesForStudent(studentId);
            return ResponseEntity.ok(courses);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/my-available-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyAvailableCourses() {
        try {
            Long studentId = getCurrentStudentId();
            List<CourseResponse> courses = courseService.getAvailableCoursesForStudent(studentId);
            return ResponseEntity.ok(courses);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // UTILITY ENDPOINTS
    // ================================
    
    @GetMapping("/departments")
    public ResponseEntity<List<String>> getAllDepartments() {
        List<String> departments = courseService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }
    
    @GetMapping("/semesters")
    public ResponseEntity<List<Integer>> getAllSemesters() {
        List<Integer> semesters = courseService.getAllSemesters();
        return ResponseEntity.ok(semesters);
    }
    
    // ================================
    // STATISTICS ENDPOINTS
    // ================================
    
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCourseStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", courseService.getActiveCourseCount());
        stats.put("totalEnrollment", courseService.getTotalEnrollment());
        stats.put("totalCapacity", courseService.getTotalCapacity());
        stats.put("utilizationRate", calculateUtilizationRate());
        stats.put("departments", courseService.getAllDepartments().size());
        stats.put("semesters", courseService.getAllSemesters().size());
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/statistics/department/{department}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCourseStatisticsByDepartment(@PathVariable String department) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("department", department);
        stats.put("courseCount", courseService.getCourseCountByDepartment(department));
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/statistics/semester/{semester}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCourseStatisticsBySemester(@PathVariable Integer semester) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("semester", semester);
        stats.put("courseCount", courseService.getCourseCountBySemester(semester));
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/statistics/instructor/{instructorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCourseStatisticsByInstructor(@PathVariable Long instructorId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("instructorId", instructorId);
        stats.put("courseCount", courseService.getCourseCountByInstructor(instructorId));
        return ResponseEntity.ok(stats);
    }
    
    // ================================
    // HELPER METHODS
    // ================================
    
    private Long getCurrentStudentId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        
        User user = (User) authentication.getPrincipal();
        
        // Find the student record associated with this user's email
        StudentResponse student = studentService.getStudentByEmail(user.getEmail());
        
        if (student == null) {
            throw new RuntimeException("Student record not found for user: " + user.getEmail());
        }
        
        return student.getId();
    }
    
    private double calculateUtilizationRate() {
        long totalEnrollment = courseService.getTotalEnrollment();
        long totalCapacity = courseService.getTotalCapacity();
        return totalCapacity > 0 ? (double) totalEnrollment / totalCapacity * 100 : 0.0;
    }
} 