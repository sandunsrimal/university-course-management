package com.erp.course.backend.dto;

import com.erp.course.backend.entity.Result;
import com.erp.course.backend.entity.Result.ResultType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ResultResponse {
    
    private Long id;
    private BigDecimal resultValue;
    private ResultType resultType;
    private String resultTypeDisplay;
    private String title;
    private String description;
    private Boolean isReleased;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime releasedAt;
    
    // Student information
    private Long studentId;
    private String studentName;
    private String studentEmail;
    
    // Course information
    private Long courseId;
    private String courseCode;
    private String courseName;
    
    // Instructor information
    private Long instructorId;
    private String instructorName;
    private String instructorEmail;
    
    // Computed fields
    private String letterResult;
    private String resultColor;
    
    // Constructors
    public ResultResponse() {}
    
    public ResultResponse(Result result) {
        this.id = result.getId();
        this.resultValue = result.getResultValue();
        this.resultType = result.getResultType();
        this.resultTypeDisplay = result.getResultType().getDisplayName();
        this.title = result.getTitle();
        this.description = result.getDescription();
        this.isReleased = result.getIsReleased();
        this.isActive = result.getIsActive();
        this.createdAt = result.getCreatedAt();
        this.updatedAt = result.getUpdatedAt();
        this.releasedAt = result.getReleasedAt();
        
        // Student information
        if (result.getStudent() != null) {
            this.studentId = result.getStudent().getId();
            this.studentName = result.getStudent().getFirstName() + " " + result.getStudent().getLastName();
            this.studentEmail = result.getStudent().getEmail();
        }
        
        // Course information
        if (result.getCourse() != null) {
            this.courseId = result.getCourse().getId();
            this.courseCode = result.getCourse().getCourseCode();
            this.courseName = result.getCourse().getCourseName();
        }
        
        // Instructor information
        if (result.getInstructor() != null) {
            this.instructorId = result.getInstructor().getId();
            this.instructorName = result.getInstructor().getFirstName() + " " + result.getInstructor().getLastName();
            this.instructorEmail = result.getInstructor().getEmail();
        }
        
        // Computed fields
        this.letterResult = result.getLetterResult();
        this.resultColor = getResultColor(result.getResultValue());
    }
    
    // Helper method to determine result color
    private String getResultColor(BigDecimal resultValue) {
        if (resultValue.compareTo(BigDecimal.valueOf(90)) >= 0) return "text-green-600";
        if (resultValue.compareTo(BigDecimal.valueOf(80)) >= 0) return "text-blue-600";
        if (resultValue.compareTo(BigDecimal.valueOf(70)) >= 0) return "text-yellow-600";
        if (resultValue.compareTo(BigDecimal.valueOf(60)) >= 0) return "text-orange-600";
        return "text-red-600";
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public BigDecimal getResultValue() {
        return resultValue;
    }
    
    public void setResultValue(BigDecimal resultValue) {
        this.resultValue = resultValue;
    }
    
    public ResultType getResultType() {
        return resultType;
    }
    
    public void setResultType(ResultType resultType) {
        this.resultType = resultType;
    }
    
    public String getResultTypeDisplay() {
        return resultTypeDisplay;
    }
    
    public void setResultTypeDisplay(String resultTypeDisplay) {
        this.resultTypeDisplay = resultTypeDisplay;
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
    
    public Boolean getIsReleased() {
        return isReleased;
    }
    
    public void setIsReleased(Boolean isReleased) {
        this.isReleased = isReleased;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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
    
    public LocalDateTime getReleasedAt() {
        return releasedAt;
    }
    
    public void setReleasedAt(LocalDateTime releasedAt) {
        this.releasedAt = releasedAt;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public String getStudentEmail() {
        return studentEmail;
    }
    
    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
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
    
    public Long getInstructorId() {
        return instructorId;
    }
    
    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }
    
    public String getInstructorName() {
        return instructorName;
    }
    
    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }
    
    public String getInstructorEmail() {
        return instructorEmail;
    }
    
    public void setInstructorEmail(String instructorEmail) {
        this.instructorEmail = instructorEmail;
    }
    
    public String getLetterResult() {
        return letterResult;
    }
    
    public void setLetterResult(String letterResult) {
        this.letterResult = letterResult;
    }
    
    public String getResultColor() {
        return resultColor;
    }
    
    public void setResultColor(String resultColor) {
        this.resultColor = resultColor;
    }
} 