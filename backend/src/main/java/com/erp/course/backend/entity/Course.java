package com.erp.course.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(min = 3, max = 20)
    @Column(unique = true, nullable = false)
    private String courseCode;
    
    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String courseName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotNull
    @Min(1)
    @Max(6)
    @Column(nullable = false)
    private Integer credits;
    
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String department;
    
    @NotNull
    @Min(1)
    @Max(6)
    @Column(nullable = false)
    private Integer semester;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate startDate;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Size(max = 100)
    private String schedule; // e.g., "MWF 10:00-11:00"
    
    @Size(max = 50)
    private String location;
    
    @NotNull
    @Min(1)
    @Max(500)
    @Column(nullable = false)
    private Integer maxCapacity;
    
    @Column(nullable = false)
    private Integer currentEnrollment = 0;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private Boolean enrollmentOpen = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructor instructor;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "course_enrollments",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Student> enrolledStudents = new HashSet<>();
    
    // Constructors
    public Course() {}
    
    public Course(String courseCode, String courseName, String description, Integer credits, 
                 String department, Integer semester, LocalDate startDate, LocalDate endDate,
                 String schedule, String location, Integer maxCapacity, Instructor instructor) {
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.description = description;
        this.credits = credits;
        this.department = department;
        this.semester = semester;
        this.startDate = startDate;
        this.endDate = endDate;
        this.schedule = schedule;
        this.location = location;
        this.maxCapacity = maxCapacity;
        this.instructor = instructor;
        this.currentEnrollment = 0;
        this.isActive = true;
        this.enrollmentOpen = true;
    }
    
    // Lifecycle methods
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.currentEnrollment == null) {
            this.currentEnrollment = 0;
        }
    }
    
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public boolean isFull() {
        return currentEnrollment >= maxCapacity;
    }
    
    public boolean canEnroll() {
        return isActive && enrollmentOpen && !isFull();
    }
    
    public void enrollStudent(Student student) {
        if (canEnroll()) {
            enrolledStudents.add(student);
            currentEnrollment = enrolledStudents.size();
        } else {
            throw new RuntimeException("Cannot enroll student: course is full or enrollment is closed");
        }
    }
    
    public void removeStudent(Student student) {
        if (enrolledStudents.remove(student)) {
            currentEnrollment = enrolledStudents.size();
        }
    }
    
    public int getAvailableSpots() {
        return maxCapacity - currentEnrollment;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getCredits() {
        return credits;
    }
    
    public void setCredits(Integer credits) {
        this.credits = credits;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public Integer getSemester() {
        return semester;
    }
    
    public void setSemester(Integer semester) {
        this.semester = semester;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public String getSchedule() {
        return schedule;
    }
    
    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public Integer getMaxCapacity() {
        return maxCapacity;
    }
    
    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
    
    public Integer getCurrentEnrollment() {
        return currentEnrollment;
    }
    
    public void setCurrentEnrollment(Integer currentEnrollment) {
        this.currentEnrollment = currentEnrollment;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public Boolean getEnrollmentOpen() {
        return enrollmentOpen;
    }
    
    public void setEnrollmentOpen(Boolean enrollmentOpen) {
        this.enrollmentOpen = enrollmentOpen;
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
    
    public Instructor getInstructor() {
        return instructor;
    }
    
    public void setInstructor(Instructor instructor) {
        this.instructor = instructor;
    }
    
    public Set<Student> getEnrolledStudents() {
        return enrolledStudents;
    }
    
    public void setEnrolledStudents(Set<Student> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
        this.currentEnrollment = enrolledStudents.size();
    }
    
    @Override
    public String toString() {
        return "Course{" +
                "id=" + id +
                ", courseCode='" + courseCode + '\'' +
                ", courseName='" + courseName + '\'' +
                ", credits=" + credits +
                ", department='" + department + '\'' +
                ", semester=" + semester +
                ", currentEnrollment=" + currentEnrollment +
                ", maxCapacity=" + maxCapacity +
                ", isActive=" + isActive +
                '}';
    }
} 