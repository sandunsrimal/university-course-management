package com.erp.course.backend.controller;

import com.erp.course.backend.dto.CourseContentRequest;
import com.erp.course.backend.dto.CourseContentResponse;
import com.erp.course.backend.dto.MessageResponse;
import com.erp.course.backend.entity.CourseContent.ContentType;
import com.erp.course.backend.entity.User;
import com.erp.course.backend.service.CourseContentService;
import com.erp.course.backend.service.InstructorService;
import com.erp.course.backend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-content")
@CrossOrigin(origins = "*")
public class CourseContentController {
    
    @Autowired
    private CourseContentService courseContentService;
    
    @Autowired
    private InstructorService instructorService;
    
    @Autowired
    private StudentService studentService;
    
    // ================================
    // INSTRUCTOR ENDPOINTS
    // ================================
    
    @GetMapping("/instructor/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<List<CourseContentResponse>> getContentForCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long instructorId = instructorService.getInstructorByEmail(user.getEmail()).getId();
            
            List<CourseContentResponse> content = courseContentService.getContentForCourse(courseId, instructorId);
            return ResponseEntity.ok(content);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    
    @PostMapping("/instructor/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<?> createContent(
            @PathVariable Long courseId,
            @Valid @RequestBody CourseContentRequest request,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long instructorId = instructorService.getInstructorByEmail(user.getEmail()).getId();
            
            CourseContentResponse content = courseContentService.createContent(courseId, request, instructorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(content);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/instructor/{contentId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<?> updateContent(
            @PathVariable Long contentId,
            @Valid @RequestBody CourseContentRequest request,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long instructorId = instructorService.getInstructorByEmail(user.getEmail()).getId();
            
            CourseContentResponse content = courseContentService.updateContent(contentId, request, instructorId);
            return ResponseEntity.ok(content);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/instructor/{contentId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<?> deleteContent(
            @PathVariable Long contentId,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long instructorId = instructorService.getInstructorByEmail(user.getEmail()).getId();
            
            courseContentService.deleteContent(contentId, instructorId);
            return ResponseEntity.ok(new MessageResponse("Content deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/instructor/{contentId}/publish")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<?> publishContent(
            @PathVariable Long contentId,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long instructorId = instructorService.getInstructorByEmail(user.getEmail()).getId();
            
            CourseContentResponse content = courseContentService.publishContent(contentId, instructorId);
            return ResponseEntity.ok(content);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/instructor/{contentId}/unpublish")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<?> unpublishContent(
            @PathVariable Long contentId,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long instructorId = instructorService.getInstructorByEmail(user.getEmail()).getId();
            
            CourseContentResponse content = courseContentService.unpublishContent(contentId, instructorId);
            return ResponseEntity.ok(content);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // STUDENT ENDPOINTS
    // ================================
    
    @GetMapping("/student/course/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseContentResponse>> getPublishedContentForCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long studentId = studentService.getStudentByEmail(user.getEmail()).getId();
            
            List<CourseContentResponse> content = courseContentService.getPublishedContentForCourse(courseId, studentId);
            return ResponseEntity.ok(content);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    
    @GetMapping("/student/course/{courseId}/type/{contentType}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseContentResponse>> getPublishedContentByType(
            @PathVariable Long courseId,
            @PathVariable ContentType contentType,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long studentId = studentService.getStudentByEmail(user.getEmail()).getId();
            
            List<CourseContentResponse> content = courseContentService.getPublishedContentByType(courseId, contentType, studentId);
            return ResponseEntity.ok(content);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    
    @GetMapping("/student/{contentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CourseContentResponse> getPublishedContentById(
            @PathVariable Long contentId,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long studentId = studentService.getStudentByEmail(user.getEmail()).getId();
            
            return courseContentService.getPublishedContentById(contentId, studentId)
                    .map(content -> ResponseEntity.ok(content))
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    
    @GetMapping("/student/course/{courseId}/announcements")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseContentResponse>> getAnnouncementsForCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long studentId = studentService.getStudentByEmail(user.getEmail()).getId();
            
            List<CourseContentResponse> announcements = courseContentService.getAnnouncementsForCourse(courseId, studentId);
            return ResponseEntity.ok(announcements);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    
    @GetMapping("/student/course/{courseId}/recent")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseContentResponse>> getRecentContentForCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long studentId = studentService.getStudentByEmail(user.getEmail()).getId();
            
            List<CourseContentResponse> recentContent = courseContentService.getRecentContentForCourse(courseId, studentId);
            return ResponseEntity.ok(recentContent);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    
    @GetMapping("/student/course/{courseId}/content-types")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ContentType>> getAvailableContentTypes(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long studentId = studentService.getStudentByEmail(user.getEmail()).getId();
            
            List<ContentType> contentTypes = courseContentService.getAvailableContentTypes(courseId, studentId);
            return ResponseEntity.ok(contentTypes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
} 