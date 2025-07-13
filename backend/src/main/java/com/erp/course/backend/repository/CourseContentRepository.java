package com.erp.course.backend.repository;

import com.erp.course.backend.entity.CourseContent;
import com.erp.course.backend.entity.CourseContent.ContentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseContentRepository extends JpaRepository<CourseContent, Long> {
    
    // Find all content for a course
    List<CourseContent> findByCourse_Id(Long courseId);
    
    // Find all active content for a course
    List<CourseContent> findByCourse_IdAndIsActiveTrue(Long courseId);
    
    // Find all published content for a course (what students see)
    List<CourseContent> findByCourse_IdAndIsActiveTrueAndIsPublishedTrue(Long courseId);
    
    // Find content by course and ordered by sort order
    List<CourseContent> findByCourse_IdAndIsActiveTrueOrderBySortOrderAsc(Long courseId);
    
    // Find published content by course and ordered by sort order
    List<CourseContent> findByCourse_IdAndIsActiveTrueAndIsPublishedTrueOrderBySortOrderAsc(Long courseId);
    
    // Find content by type
    List<CourseContent> findByCourse_IdAndContentTypeAndIsActiveTrue(Long courseId, ContentType contentType);
    
    // Find published content by type
    List<CourseContent> findByCourse_IdAndContentTypeAndIsActiveTrueAndIsPublishedTrue(Long courseId, ContentType contentType);
    
    // Find content created by instructor
    List<CourseContent> findByCreatedByIdAndIsActiveTrue(Long instructorId);
    
    // Find content by course and instructor
    List<CourseContent> findByCourse_IdAndCreatedByIdAndIsActiveTrue(Long courseId, Long instructorId);
    
    // Search content by title
    @Query("SELECT cc FROM CourseContent cc WHERE " +
           "cc.course.id = :courseId AND " +
           "cc.isActive = true AND " +
           "LOWER(cc.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<CourseContent> searchContentByTitle(@Param("courseId") Long courseId, @Param("searchTerm") String searchTerm);
    
    // Search published content by title
    @Query("SELECT cc FROM CourseContent cc WHERE " +
           "cc.course.id = :courseId AND " +
           "cc.isActive = true AND " +
           "cc.isPublished = true AND " +
           "LOWER(cc.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<CourseContent> searchPublishedContentByTitle(@Param("courseId") Long courseId, @Param("searchTerm") String searchTerm);
    
    // Count content by course
    Long countByCourse_IdAndIsActiveTrue(Long courseId);
    
    // Count published content by course
    Long countByCourse_IdAndIsActiveTrueAndIsPublishedTrue(Long courseId);
    
    // Count content by type
    Long countByCourse_IdAndContentTypeAndIsActiveTrue(Long courseId, ContentType contentType);
    
    // Find content by course and instructor (for authorization)
    @Query("SELECT cc FROM CourseContent cc WHERE " +
           "cc.course.id = :courseId AND " +
           "cc.course.instructor.id = :instructorId AND " +
           "cc.isActive = true")
    List<CourseContent> findByCourseAndInstructor(@Param("courseId") Long courseId, @Param("instructorId") Long instructorId);
    
    // Check if instructor owns the content
    @Query("SELECT COUNT(cc) > 0 FROM CourseContent cc WHERE " +
           "cc.id = :contentId AND " +
           "cc.course.instructor.id = :instructorId")
    boolean isContentOwnedByInstructor(@Param("contentId") Long contentId, @Param("instructorId") Long instructorId);
    
    // Get next sort order for a course
    @Query("SELECT COALESCE(MAX(cc.sortOrder), 0) + 1 FROM CourseContent cc WHERE cc.course.id = :courseId")
    Integer getNextSortOrder(@Param("courseId") Long courseId);
    
    // Find content by file path (for file management)
    Optional<CourseContent> findByFilePath(String filePath);
    
    // Find all content with files (for cleanup)
    @Query("SELECT cc FROM CourseContent cc WHERE cc.filePath IS NOT NULL AND cc.filePath != ''")
    List<CourseContent> findAllWithFiles();
    
    // Find content by course and content type ordered by sort order
    @Query("SELECT cc FROM CourseContent cc WHERE " +
           "cc.course.id = :courseId AND " +
           "cc.contentType = :contentType AND " +
           "cc.isActive = true AND " +
           "cc.isPublished = true " +
           "ORDER BY cc.sortOrder ASC")
    List<CourseContent> findPublishedContentByTypeOrdered(@Param("courseId") Long courseId, @Param("contentType") ContentType contentType);
    
    // Get distinct content types for a course
    @Query("SELECT DISTINCT cc.contentType FROM CourseContent cc WHERE " +
           "cc.course.id = :courseId AND " +
           "cc.isActive = true AND " +
           "cc.isPublished = true")
    List<ContentType> getDistinctContentTypes(@Param("courseId") Long courseId);
    
    // Find recent content (last 30 days)
    @Query("SELECT cc FROM CourseContent cc WHERE " +
           "cc.course.id = :courseId AND " +
           "cc.isActive = true AND " +
           "cc.isPublished = true AND " +
           "cc.createdAt >= :thirtyDaysAgo " +
           "ORDER BY cc.createdAt DESC")
    List<CourseContent> findRecentContent(@Param("courseId") Long courseId, @Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);
    
    // Find announcements (for special handling)
    @Query("SELECT cc FROM CourseContent cc WHERE " +
           "cc.course.id = :courseId AND " +
           "cc.contentType = 'ANNOUNCEMENT' AND " +
           "cc.isActive = true AND " +
           "cc.isPublished = true " +
           "ORDER BY cc.createdAt DESC")
    List<CourseContent> findAnnouncementsForCourse(@Param("courseId") Long courseId);
} 