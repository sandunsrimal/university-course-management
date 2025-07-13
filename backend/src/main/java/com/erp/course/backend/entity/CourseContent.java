package com.erp.course.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_contents")
public class CourseContent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentType contentType;
    
    @Column(columnDefinition = "TEXT")
    private String content; // For text content, HTML, or file paths
    
    @Size(max = 255)
    private String filePath; // For file uploads
    
    @Size(max = 100)
    private String fileName; // Original file name
    
    @Size(max = 50)
    private String fileType; // MIME type
    
    private Long fileSize; // File size in bytes
    
    @Column(nullable = false)
    private Integer sortOrder = 0; // For ordering content within a course
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private Boolean isPublished = false; // Draft vs Published
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private Instructor createdBy;
    
    // Enums
    public enum ContentType {
        LECTURE_NOTES,
        ASSIGNMENT,
        READING_MATERIAL,
        VIDEO,
        DOCUMENT,
        PRESENTATION,
        QUIZ,
        ANNOUNCEMENT,
        RESOURCE_LINK,
        OTHER
    }
    
    // Constructors
    public CourseContent() {}
    
    public CourseContent(String title, String description, ContentType contentType, 
                        String content, Course course, Instructor createdBy) {
        this.title = title;
        this.description = description;
        this.contentType = contentType;
        this.content = content;
        this.course = course;
        this.createdBy = createdBy;
        this.sortOrder = 0;
        this.isActive = true;
        this.isPublished = false;
    }
    
    // Lifecycle methods
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public boolean isFileContent() {
        return filePath != null && !filePath.isEmpty();
    }
    
    public boolean isTextContent() {
        return content != null && !content.isEmpty();
    }
    
    public String getContentTypeDisplayName() {
        switch (contentType) {
            case LECTURE_NOTES: return "Lecture Notes";
            case ASSIGNMENT: return "Assignment";
            case READING_MATERIAL: return "Reading Material";
            case VIDEO: return "Video";
            case DOCUMENT: return "Document";
            case PRESENTATION: return "Presentation";
            case QUIZ: return "Quiz";
            case ANNOUNCEMENT: return "Announcement";
            case RESOURCE_LINK: return "Resource Link";
            case OTHER: return "Other";
            default: return contentType.toString();
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public ContentType getContentType() {
        return contentType;
    }
    
    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public Integer getSortOrder() {
        return sortOrder;
    }
    
    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public Boolean getIsPublished() {
        return isPublished;
    }
    
    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Course getCourse() {
        return course;
    }
    
    public void setCourse(Course course) {
        this.course = course;
    }
    
    public Instructor getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(Instructor createdBy) {
        this.createdBy = createdBy;
    }
    
    @Override
    public String toString() {
        return "CourseContent{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", contentType=" + contentType +
                ", isPublished=" + isPublished +
                ", sortOrder=" + sortOrder +
                ", isActive=" + isActive +
                '}';
    }
} 