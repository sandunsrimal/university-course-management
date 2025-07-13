package com.erp.course.backend.service;

import com.erp.course.backend.entity.Course;
import com.erp.course.backend.entity.CourseContent;
import com.erp.course.backend.entity.Instructor;
import com.erp.course.backend.entity.CourseContent.ContentType;
import com.erp.course.backend.dto.CourseContentRequest;
import com.erp.course.backend.dto.CourseContentResponse;
import com.erp.course.backend.repository.CourseContentRepository;
import com.erp.course.backend.repository.CourseRepository;
import com.erp.course.backend.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseContentService {
    
    @Autowired
    private CourseContentRepository courseContentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private InstructorRepository instructorRepository;
    
    // ================================
    // INSTRUCTOR CONTENT MANAGEMENT
    // ================================
    
    public List<CourseContentResponse> getContentForCourse(Long courseId, Long instructorId) {
        // Verify instructor owns the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("Access denied: You are not the instructor of this course");
        }
        
        return courseContentRepository.findByCourse_IdAndIsActiveTrueOrderBySortOrderAsc(courseId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public CourseContentResponse createContent(Long courseId, CourseContentRequest request, Long instructorId) {
        // Verify instructor owns the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("Access denied: You are not the instructor of this course");
        }
        
        Instructor instructor = instructorRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
        
        // Set sort order if not provided
        if (request.getSortOrder() == null || request.getSortOrder() == 0) {
            request.setSortOrder(courseContentRepository.getNextSortOrder(courseId));
        }
        
        CourseContent content = convertToEntity(request);
        content.setCourse(course);
        content.setCreatedBy(instructor);
        
        CourseContent savedContent = courseContentRepository.save(content);
        return convertToResponse(savedContent);
    }
    
    public CourseContentResponse updateContent(Long contentId, CourseContentRequest request, Long instructorId) {
        CourseContent existingContent = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        
        // Verify instructor owns the content
        if (!existingContent.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("Access denied: You are not the instructor of this course");
        }
        
        updateContentFields(existingContent, request);
        CourseContent updatedContent = courseContentRepository.save(existingContent);
        return convertToResponse(updatedContent);
    }
    
    public void deleteContent(Long contentId, Long instructorId) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        
        // Verify instructor owns the content
        if (!content.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("Access denied: You are not the instructor of this course");
        }
        
        content.setIsActive(false);
        courseContentRepository.save(content);
    }
    
    public CourseContentResponse publishContent(Long contentId, Long instructorId) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        
        // Verify instructor owns the content
        if (!content.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("Access denied: You are not the instructor of this course");
        }
        
        content.setIsPublished(true);
        CourseContent updatedContent = courseContentRepository.save(content);
        return convertToResponse(updatedContent);
    }
    
    public CourseContentResponse unpublishContent(Long contentId, Long instructorId) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        
        // Verify instructor owns the content
        if (!content.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new RuntimeException("Access denied: You are not the instructor of this course");
        }
        
        content.setIsPublished(false);
        CourseContent updatedContent = courseContentRepository.save(content);
        return convertToResponse(updatedContent);
    }
    
    // ================================
    // STUDENT CONTENT ACCESS
    // ================================
    
    public List<CourseContentResponse> getPublishedContentForCourse(Long courseId, Long studentId) {
        // Verify student is enrolled in the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        boolean isEnrolled = course.getEnrolledStudents().stream()
                .anyMatch(student -> student.getId().equals(studentId));
        
        if (!isEnrolled) {
            throw new RuntimeException("Access denied: You are not enrolled in this course");
        }
        
        return courseContentRepository.findByCourse_IdAndIsActiveTrueAndIsPublishedTrueOrderBySortOrderAsc(courseId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CourseContentResponse> getPublishedContentByType(Long courseId, ContentType contentType, Long studentId) {
        // Verify student is enrolled in the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        boolean isEnrolled = course.getEnrolledStudents().stream()
                .anyMatch(student -> student.getId().equals(studentId));
        
        if (!isEnrolled) {
            throw new RuntimeException("Access denied: You are not enrolled in this course");
        }
        
        return courseContentRepository.findPublishedContentByTypeOrdered(courseId, contentType)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<CourseContentResponse> getPublishedContentById(Long contentId, Long studentId) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        
        if (!content.getIsPublished() || !content.getIsActive()) {
            throw new RuntimeException("Content not available");
        }
        
        // Verify student is enrolled in the course
        Course course = content.getCourse();
        boolean isEnrolled = course.getEnrolledStudents().stream()
                .anyMatch(student -> student.getId().equals(studentId));
        
        if (!isEnrolled) {
            throw new RuntimeException("Access denied: You are not enrolled in this course");
        }
        
        return Optional.of(convertToResponse(content));
    }
    
    public List<CourseContentResponse> getAnnouncementsForCourse(Long courseId, Long studentId) {
        // Verify student is enrolled in the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        boolean isEnrolled = course.getEnrolledStudents().stream()
                .anyMatch(student -> student.getId().equals(studentId));
        
        if (!isEnrolled) {
            throw new RuntimeException("Access denied: You are not enrolled in this course");
        }
        
        return courseContentRepository.findAnnouncementsForCourse(courseId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CourseContentResponse> getRecentContentForCourse(Long courseId, Long studentId) {
        // Verify student is enrolled in the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        boolean isEnrolled = course.getEnrolledStudents().stream()
                .anyMatch(student -> student.getId().equals(studentId));
        
        if (!isEnrolled) {
            throw new RuntimeException("Access denied: You are not enrolled in this course");
        }
        
        // Calculate 30 days ago
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        return courseContentRepository.findRecentContent(courseId, thirtyDaysAgo)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // ================================
    // UTILITY METHODS
    // ================================
    
    public List<ContentType> getAvailableContentTypes(Long courseId, Long studentId) {
        // Verify student is enrolled in the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        boolean isEnrolled = course.getEnrolledStudents().stream()
                .anyMatch(student -> student.getId().equals(studentId));
        
        if (!isEnrolled) {
            throw new RuntimeException("Access denied: You are not enrolled in this course");
        }
        
        return courseContentRepository.getDistinctContentTypes(courseId);
    }
    
    // ================================
    // CONVERSION METHODS
    // ================================
    
    private CourseContent convertToEntity(CourseContentRequest request) {
        CourseContent content = new CourseContent();
        content.setTitle(request.getTitle());
        content.setDescription(request.getDescription());
        content.setContentType(request.getContentType());
        content.setContent(request.getContent());
        content.setSortOrder(request.getSortOrder());
        content.setIsPublished(request.getIsPublished());
        content.setFileName(request.getFileName());
        content.setFileType(request.getFileType());
        content.setFileSize(request.getFileSize());
        return content;
    }
    
    private void updateContentFields(CourseContent content, CourseContentRequest request) {
        content.setTitle(request.getTitle());
        content.setDescription(request.getDescription());
        content.setContentType(request.getContentType());
        content.setContent(request.getContent());
        if (request.getSortOrder() != null) {
            content.setSortOrder(request.getSortOrder());
        }
        if (request.getIsPublished() != null) {
            content.setIsPublished(request.getIsPublished());
        }
        if (request.getFileName() != null) {
            content.setFileName(request.getFileName());
        }
        if (request.getFileType() != null) {
            content.setFileType(request.getFileType());
        }
        if (request.getFileSize() != null) {
            content.setFileSize(request.getFileSize());
        }
    }
    
    private CourseContentResponse convertToResponse(CourseContent content) {
        CourseContentResponse response = new CourseContentResponse();
        response.setId(content.getId());
        response.setTitle(content.getTitle());
        response.setDescription(content.getDescription());
        response.setContentType(content.getContentType());
        response.setContent(content.getContent());
        response.setFilePath(content.getFilePath());
        response.setFileName(content.getFileName());
        response.setFileType(content.getFileType());
        response.setFileSize(content.getFileSize());
        response.setSortOrder(content.getSortOrder());
        response.setIsActive(content.getIsActive());
        response.setIsPublished(content.getIsPublished());
        response.setCreatedAt(content.getCreatedAt());
        response.setUpdatedAt(content.getUpdatedAt());
        
        // Set course information
        if (content.getCourse() != null) {
            response.setCourseId(content.getCourse().getId());
            response.setCourseCode(content.getCourse().getCourseCode());
            response.setCourseName(content.getCourse().getCourseName());
        }
        
        // Set creator information
        if (content.getCreatedBy() != null) {
            response.setCreatedById(content.getCreatedBy().getId());
            response.setCreatedByName(content.getCreatedBy().getFullName());
            response.setCreatedByEmail(content.getCreatedBy().getEmail());
        }
        
        return response;
    }
} 