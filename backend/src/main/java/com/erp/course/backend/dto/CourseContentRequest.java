package com.erp.course.backend.dto;

import com.erp.course.backend.entity.CourseContent.ContentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;

public class CourseContentRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Content type is required")
    private ContentType contentType;
    
    private String content; // For text content
    
    @Min(value = 0, message = "Sort order must be non-negative")
    private Integer sortOrder = 0;
    
    private Boolean isPublished = false;
    
    // File information (for file uploads)
    private String fileName;
    private String fileType;
    private Long fileSize;
    
    // Constructors
    public CourseContentRequest() {}
    
    public CourseContentRequest(String title, String description, ContentType contentType, 
                               String content, Integer sortOrder, Boolean isPublished) {
        this.title = title;
        this.description = description;
        this.contentType = contentType;
        this.content = content;
        this.sortOrder = sortOrder != null ? sortOrder : 0;
        this.isPublished = isPublished != null ? isPublished : false;
    }
    
    // Getters and Setters
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
    
    public Integer getSortOrder() {
        return sortOrder;
    }
    
    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
    
    public Boolean getIsPublished() {
        return isPublished;
    }
    
    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
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
    
    @Override
    public String toString() {
        return "CourseContentRequest{" +
                "title='" + title + '\'' +
                ", contentType=" + contentType +
                ", isPublished=" + isPublished +
                ", sortOrder=" + sortOrder +
                '}';
    }
} 