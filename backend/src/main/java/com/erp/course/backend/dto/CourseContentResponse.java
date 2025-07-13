package com.erp.course.backend.dto;

import com.erp.course.backend.entity.CourseContent.ContentType;
import java.time.LocalDateTime;

public class CourseContentResponse {
    
    private Long id;
    private String title;
    private String description;
    private ContentType contentType;
    private String contentTypeDisplayName;
    private String content;
    private String filePath;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private Integer sortOrder;
    private Boolean isActive;
    private Boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Course information
    private Long courseId;
    private String courseCode;
    private String courseName;
    
    // Creator information
    private Long createdById;
    private String createdByName;
    private String createdByEmail;
    
    // Helper flags
    private Boolean isFileContent;
    private Boolean isTextContent;
    
    // Constructors
    public CourseContentResponse() {}
    
    public CourseContentResponse(Long id, String title, String description, ContentType contentType,
                                String content, String filePath, String fileName, String fileType,
                                Long fileSize, Integer sortOrder, Boolean isActive, Boolean isPublished,
                                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.contentType = contentType;
        this.contentTypeDisplayName = getContentTypeDisplayName(contentType);
        this.content = content;
        this.filePath = filePath;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.sortOrder = sortOrder;
        this.isActive = isActive;
        this.isPublished = isPublished;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isFileContent = filePath != null && !filePath.isEmpty();
        this.isTextContent = content != null && !content.isEmpty();
    }
    
    // Helper method
    private String getContentTypeDisplayName(ContentType contentType) {
        if (contentType == null) return "";
        
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
        this.contentTypeDisplayName = getContentTypeDisplayName(contentType);
    }
    
    public String getContentTypeDisplayName() {
        return contentTypeDisplayName;
    }
    
    public void setContentTypeDisplayName(String contentTypeDisplayName) {
        this.contentTypeDisplayName = contentTypeDisplayName;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
        this.isTextContent = content != null && !content.isEmpty();
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
        this.isFileContent = filePath != null && !filePath.isEmpty();
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
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public String getCourseCode() {
        return courseCode;
    }
    
    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
    
    public Long getCreatedById() {
        return createdById;
    }
    
    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }
    
    public String getCreatedByName() {
        return createdByName;
    }
    
    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }
    
    public String getCreatedByEmail() {
        return createdByEmail;
    }
    
    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }
    
    public Boolean getIsFileContent() {
        return isFileContent;
    }
    
    public void setIsFileContent(Boolean isFileContent) {
        this.isFileContent = isFileContent;
    }
    
    public Boolean getIsTextContent() {
        return isTextContent;
    }
    
    public void setIsTextContent(Boolean isTextContent) {
        this.isTextContent = isTextContent;
    }
    
    @Override
    public String toString() {
        return "CourseContentResponse{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", contentType=" + contentType +
                ", isPublished=" + isPublished +
                ", sortOrder=" + sortOrder +
                ", courseCode='" + courseCode + '\'' +
                '}';
    }
} 