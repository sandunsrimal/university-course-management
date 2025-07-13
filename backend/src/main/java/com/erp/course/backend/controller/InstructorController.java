package com.erp.course.backend.controller;

import com.erp.course.backend.dto.*;
import com.erp.course.backend.service.CourseService;
import com.erp.course.backend.service.InstructorService;
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
@RequestMapping("/api/instructor")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('INSTRUCTOR')")
public class InstructorController {
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private InstructorService instructorService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private ResultService resultService;
    
    // ================================
    // INSTRUCTOR PROFILE ENDPOINTS
    // ================================
    
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile() {
        try {
            Long instructorId = getCurrentInstructorId();
            InstructorResponse profile = instructorService.getInstructorByIdOrThrow(instructorId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getMyProfile: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateMyProfile(@Valid @RequestBody InstructorRequest request) {
        try {
            Long instructorId = getCurrentInstructorId();
            InstructorResponse updated = instructorService.updateInstructor(instructorId, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // COURSE MANAGEMENT ENDPOINTS
    // ================================
    
    @GetMapping("/courses")
    public ResponseEntity<?> getMyCourses() {
        try {
            Long instructorId = getCurrentInstructorId();
            List<CourseResponse> courses = courseService.getCoursesByInstructor(instructorId);
            return ResponseEntity.ok(courses);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getMyCourses: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/courses/active")
    public ResponseEntity<List<CourseResponse>> getMyActiveCourses() {
        try {
            Long instructorId = getCurrentInstructorId();
            List<CourseResponse> courses = courseService.getActiveCoursesByInstructor(instructorId);
            return ResponseEntity.ok(courses);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseResponse> getMyCourseById(@PathVariable Long courseId) {
        try {
            Long instructorId = getCurrentInstructorId();
            CourseResponse course = courseService.getCourseByIdOrThrow(courseId);
            
            // Verify the course belongs to this instructor
            if (!course.getInstructorId().equals(instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/courses/{courseId}")
    public ResponseEntity<?> updateMyCourse(@PathVariable Long courseId, @Valid @RequestBody CourseRequest request) {
        try {
            Long instructorId = getCurrentInstructorId();
            CourseResponse existingCourse = courseService.getCourseByIdOrThrow(courseId);
            
            // Verify the course belongs to this instructor
            if (!existingCourse.getInstructorId().equals(instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("You can only update your own courses"));
            }
            
            CourseResponse updated = courseService.updateCourse(courseId, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/courses/{courseId}/enrollment/open")
    public ResponseEntity<?> openEnrollment(@PathVariable Long courseId) {
        try {
            Long instructorId = getCurrentInstructorId();
            CourseResponse existingCourse = courseService.getCourseByIdOrThrow(courseId);
            
            // Verify the course belongs to this instructor
            if (!existingCourse.getInstructorId().equals(instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("You can only manage your own courses"));
            }
            
            courseService.openEnrollment(courseId);
            return ResponseEntity.ok(new MessageResponse("Enrollment opened successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/courses/{courseId}/enrollment/close")
    public ResponseEntity<?> closeEnrollment(@PathVariable Long courseId) {
        try {
            Long instructorId = getCurrentInstructorId();
            CourseResponse existingCourse = courseService.getCourseByIdOrThrow(courseId);
            
            // Verify the course belongs to this instructor
            if (!existingCourse.getInstructorId().equals(instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("You can only manage your own courses"));
            }
            
            courseService.closeEnrollment(courseId);
            return ResponseEntity.ok(new MessageResponse("Enrollment closed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // STUDENT MANAGEMENT ENDPOINTS
    // ================================
    
    @GetMapping("/courses/{courseId}/students")
    public ResponseEntity<List<StudentResponse>> getStudentsInMyCourse(@PathVariable Long courseId) {
        try {
            Long instructorId = getCurrentInstructorId();
            CourseResponse course = courseService.getCourseByIdOrThrow(courseId);
            
            // Verify the course belongs to this instructor
            if (!course.getInstructorId().equals(instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            List<StudentResponse> students = courseService.getStudentsInCourse(courseId);
            return ResponseEntity.ok(students);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/courses/{courseId}/students/{studentId}")
    public ResponseEntity<?> removeStudentFromMyCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            Long instructorId = getCurrentInstructorId();
            CourseResponse course = courseService.getCourseByIdOrThrow(courseId);
            
            // Verify the course belongs to this instructor
            if (!course.getInstructorId().equals(instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("You can only manage your own courses"));
            }
            
            courseService.removeStudentFromCourse(courseId, studentId);
            return ResponseEntity.ok(new MessageResponse("Student removed from course successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // STATISTICS ENDPOINTS
    // ================================
    
    @GetMapping("/statistics")
    public ResponseEntity<?> getMyStatistics() {
        try {
            Long instructorId = getCurrentInstructorId();
            Map<String, Object> statistics = new HashMap<>();
            
            // Course statistics
            statistics.put("totalCourses", courseService.getCourseCountByInstructor(instructorId));
            statistics.put("activeCourses", courseService.getActiveCourseCountByInstructor(instructorId));
            statistics.put("totalStudents", courseService.getTotalStudentCountByInstructor(instructorId));
            statistics.put("averageEnrollment", courseService.getAverageEnrollmentByInstructor(instructorId));
            
            // Department statistics
            statistics.put("department", instructorService.getInstructorByIdOrThrow(instructorId).getDepartment());
            
            return ResponseEntity.ok(statistics);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getMyStatistics: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/courses/{courseId}/statistics")
    public ResponseEntity<Map<String, Object>> getMyCourseStatistics(@PathVariable Long courseId) {
        try {
            Long instructorId = getCurrentInstructorId();
            CourseResponse course = courseService.getCourseByIdOrThrow(courseId);
            
            // Verify the course belongs to this instructor
            if (!course.getInstructorId().equals(instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("courseName", course.getCourseName());
            statistics.put("courseCode", course.getCourseCode());
            statistics.put("currentEnrollment", course.getCurrentEnrollment());
            statistics.put("maxCapacity", course.getMaxCapacity());
            statistics.put("availableSpots", course.getAvailableSpots());
            statistics.put("enrollmentOpen", course.getEnrollmentOpen());
            statistics.put("utilizationRate", course.getMaxCapacity() > 0 ? 
                (double) course.getCurrentEnrollment() / course.getMaxCapacity() * 100 : 0.0);
            
            return ResponseEntity.ok(statistics);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ================================
    // RESULT MANAGEMENT ENDPOINTS
    // ================================
    
    @GetMapping("/courses/{courseId}/results")
    public ResponseEntity<?> getResultsForCourse(@PathVariable Long courseId) {
        try {
            Long instructorId = getCurrentInstructorId();
            List<ResultResponse> results = resultService.getResultsByCourse(courseId);
            return ResponseEntity.ok(results);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getResultsForCourse: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/courses/{courseId}/students/{studentId}/results")
    public ResponseEntity<?> getResultsForStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            Long instructorId = getCurrentInstructorId();
            List<ResultResponse> results = resultService.getResultsByCourseAndStudent(courseId, studentId);
            return ResponseEntity.ok(results);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getResultsForStudent: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/results")
    public ResponseEntity<?> createResult(@Valid @RequestBody ResultRequest request) {
        try {
            Long instructorId = getCurrentInstructorId();
            ResultResponse result = resultService.createResult(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in createResult: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/results/{resultId}")
    public ResponseEntity<?> updateResult(@PathVariable Long resultId, @Valid @RequestBody ResultRequest request) {
        try {
            Long instructorId = getCurrentInstructorId();
            ResultResponse result = resultService.updateResult(resultId, request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in updateResult: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/results/{resultId}")
    public ResponseEntity<?> deleteResult(@PathVariable Long resultId) {
        try {
            Long instructorId = getCurrentInstructorId();
            resultService.deleteResult(resultId);
            return ResponseEntity.ok(new MessageResponse("Result deleted successfully"));
        } catch (RuntimeException e) {
            System.out.println("❌ Error in deleteResult: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/results/{resultId}")
    public ResponseEntity<?> getResultById(@PathVariable Long resultId) {
        try {
            Long instructorId = getCurrentInstructorId();
            ResultResponse result = resultService.getResultById(resultId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getResultById: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // RESULT RELEASE ENDPOINTS
    // ================================
    
    @PutMapping("/results/{resultId}/release")
    public ResponseEntity<?> releaseResult(@PathVariable Long resultId) {
        try {
            Long instructorId = getCurrentInstructorId();
            ResultResponse result = resultService.releaseResult(resultId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in releaseResult: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/results/{resultId}/unrelease")
    public ResponseEntity<?> unreleaseResult(@PathVariable Long resultId) {
        try {
            Long instructorId = getCurrentInstructorId();
            ResultResponse result = resultService.unreleaseResult(resultId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in unreleaseResult: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/courses/{courseId}/results/release")
    public ResponseEntity<?> releaseAllResultsForCourse(@PathVariable Long courseId) {
        try {
            Long instructorId = getCurrentInstructorId();
            resultService.bulkReleaseResultsForCourse(courseId);
            return ResponseEntity.ok(new MessageResponse("All results released successfully"));
        } catch (RuntimeException e) {
            System.out.println("❌ Error in releaseAllResultsForCourse: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // RESULT STATISTICS ENDPOINTS
    // ================================
    
    @GetMapping("/courses/{courseId}/results/average")
    public ResponseEntity<?> getAverageResultForCourse(@PathVariable Long courseId) {
        try {
            Double average = resultService.getAverageResultForCourse(courseId);
            Map<String, Object> response = new HashMap<>();
            response.put("courseId", courseId);
            response.put("averageResult", average);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getAverageResultForCourse: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/courses/{courseId}/students/{studentId}/results/average")
    public ResponseEntity<?> getAverageResultForStudentInCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            Double average = resultService.getAverageResultForStudentInCourse(courseId, studentId);
            Map<String, Object> response = new HashMap<>();
            response.put("courseId", courseId);
            response.put("studentId", studentId);
            response.put("averageResult", average);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("❌ Error in getAverageResultForStudentInCourse: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // UTILITY METHODS
    // ================================
    
    private Long getCurrentInstructorId() {
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
        
        System.out.println("🔍 Looking for instructor with email: " + email);
        
        try {
            InstructorResponse instructor = instructorService.getInstructorByEmail(email);
            System.out.println("✅ Found instructor: " + instructor.getId() + " - " + instructor.getFirstName() + " " + instructor.getLastName());
            return instructor.getId();
        } catch (RuntimeException e) {
            System.out.println("❌ Failed to find instructor with email: " + email + " - Error: " + e.getMessage());
            throw new RuntimeException("Instructor not found with email: " + email + ". Please contact admin to create instructor profile.");
        }
    }
} 