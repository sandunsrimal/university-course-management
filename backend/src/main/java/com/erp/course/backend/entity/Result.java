package com.erp.course.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "results")
public class Result {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @DecimalMin(value = "0.0", message = "Result cannot be negative")
    @DecimalMax(value = "100.0", message = "Result cannot exceed 100")
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal resultValue;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResultType resultType;
    
    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String title; // e.g., "Midterm Exam", "Final Project", "Quiz 1"
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Boolean isReleased = false; // Whether the result is visible to students
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "released_at")
    private LocalDateTime releasedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructor instructor;
    
    // Enums
    public enum ResultType {
        ASSIGNMENT("Assignment"),
        QUIZ("Quiz"),
        MIDTERM("Midterm Exam"),
        FINAL("Final Exam"),
        PROJECT("Project"),
        PARTICIPATION("Participation"),
        PRESENTATION("Presentation"),
        LAB("Lab Work"),
        OTHER("Other");
        
        private final String displayName;
        
        ResultType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Constructors
    public Result() {}
    
    public Result(BigDecimal resultValue, ResultType resultType, String title, String description,
                Student student, Course course, Instructor instructor) {
        this.resultValue = resultValue;
        this.resultType = resultType;
        this.title = title;
        this.description = description;
        this.student = student;
        this.course = course;
        this.instructor = instructor;
        this.isReleased = false;
        this.isActive = true;
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
    public void release() {
        this.isReleased = true;
        this.releasedAt = LocalDateTime.now();
    }
    
    public void unrelease() {
        this.isReleased = false;
        this.releasedAt = null;
    }
    
    public String getLetterResult() {
        if (resultValue.compareTo(BigDecimal.valueOf(90)) >= 0) return "A";
        if (resultValue.compareTo(BigDecimal.valueOf(80)) >= 0) return "B";
        if (resultValue.compareTo(BigDecimal.valueOf(70)) >= 0) return "C";
        if (resultValue.compareTo(BigDecimal.valueOf(60)) >= 0) return "D";
        return "F";
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
        if (isReleased && releasedAt == null) {
            this.releasedAt = LocalDateTime.now();
        }
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
    
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }
    
    public Course getCourse() {
        return course;
    }
    
    public void setCourse(Course course) {
        this.course = course;
    }
    
    public Instructor getInstructor() {
        return instructor;
    }
    
    public void setInstructor(Instructor instructor) {
        this.instructor = instructor;
    }
} 