package com.erp.course.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public class ResultRequest {
    
    @NotNull
    @DecimalMin(value = "0.0", message = "Result cannot be negative")
    @DecimalMax(value = "100.0", message = "Result cannot exceed 100")
    private BigDecimal resultValue;
    
    @NotNull(message = "Result type is required")
    private String resultType;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Student ID is required")
    private Long studentId;
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
    
    // Instructor ID will be set automatically from authenticated user
    private Long instructorId;
    
    private Boolean isReleased = false;
    
    // Constructors
    public ResultRequest() {}
    
    public ResultRequest(BigDecimal resultValue, String resultType, String title, String description,
                        Long studentId, Long courseId, Long instructorId) {
        this.resultValue = resultValue;
        this.resultType = resultType;
        this.title = title;
        this.description = description;
        this.studentId = studentId;
        this.courseId = courseId;
        this.instructorId = instructorId;
    }
    
    // Getters and Setters
    public BigDecimal getResultValue() {
        return resultValue;
    }
    
    public void setResultValue(BigDecimal resultValue) {
        this.resultValue = resultValue;
    }
    
    public String getResultType() {
        return resultType;
    }
    
    public void setResultType(String resultType) {
        this.resultType = resultType;
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
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public Long getInstructorId() {
        return instructorId;
    }
    
    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }
    
    public Boolean getIsReleased() {
        return isReleased;
    }
    
    public void setIsReleased(Boolean isReleased) {
        this.isReleased = isReleased;
    }
} 