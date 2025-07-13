package com.erp.course.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class CourseResponse {
    
    private Long id;
    private String courseCode;
    private String courseName;
    private String description;
    private Integer credits;
    private String department;
    private Integer semester;
    private LocalDate startDate;
    private LocalDate endDate;
    private String schedule;
    private String location;
    private Integer maxCapacity;
    private Integer currentEnrollment;
    private Integer availableSpots;
    private Boolean isActive;
    private Boolean enrollmentOpen;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Instructor information
    private Long instructorId;
    private String instructorName;
    private String instructorEmail;
    private String instructorDepartment;
    
    // Enrollment information
    private List<EnrolledStudentInfo> enrolledStudents;
    private Boolean isFull;
    private Boolean canEnroll;
    
    // Inner class for enrolled student information
    public static class EnrolledStudentInfo {
        private Long studentId;
        private String studentNumber;
        private String studentName;
        private String studentEmail;
        private String major;
        private Integer year;
        
        // Constructors
        public EnrolledStudentInfo() {}
        
        public EnrolledStudentInfo(Long studentId, String studentNumber, String studentName, 
                                  String studentEmail, String major, Integer year) {
            this.studentId = studentId;
            this.studentNumber = studentNumber;
            this.studentName = studentName;
            this.studentEmail = studentEmail;
            this.major = major;
            this.year = year;
        }
        
        // Getters and Setters
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        
        public String getStudentNumber() { return studentNumber; }
        public void setStudentNumber(String studentNumber) { this.studentNumber = studentNumber; }
        
        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
        
        public String getStudentEmail() { return studentEmail; }
        public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
        
        public String getMajor() { return major; }
        public void setMajor(String major) { this.major = major; }
        
        public Integer getYear() { return year; }
        public void setYear(Integer year) { this.year = year; }
    }
    
    // Constructors
    public CourseResponse() {}
    
    public CourseResponse(Long id, String courseCode, String courseName, String description, 
                         Integer credits, String department, Integer semester, LocalDate startDate, 
                         LocalDate endDate, String schedule, String location, Integer maxCapacity, 
                         Integer currentEnrollment, Boolean isActive, Boolean enrollmentOpen, 
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
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
        this.currentEnrollment = currentEnrollment;
        this.availableSpots = maxCapacity - currentEnrollment;
        this.isActive = isActive;
        this.enrollmentOpen = enrollmentOpen;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isFull = currentEnrollment >= maxCapacity;
        this.canEnroll = isActive && enrollmentOpen && !isFull;
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
        this.availableSpots = maxCapacity - (currentEnrollment != null ? currentEnrollment : 0);
    }
    
    public Integer getCurrentEnrollment() {
        return currentEnrollment;
    }
    
    public void setCurrentEnrollment(Integer currentEnrollment) {
        this.currentEnrollment = currentEnrollment;
        this.availableSpots = (maxCapacity != null ? maxCapacity : 0) - currentEnrollment;
        this.isFull = currentEnrollment >= (maxCapacity != null ? maxCapacity : 0);
    }
    
    public Integer getAvailableSpots() {
        return availableSpots;
    }
    
    public void setAvailableSpots(Integer availableSpots) {
        this.availableSpots = availableSpots;
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
    
    public String getInstructorDepartment() {
        return instructorDepartment;
    }
    
    public void setInstructorDepartment(String instructorDepartment) {
        this.instructorDepartment = instructorDepartment;
    }
    
    public List<EnrolledStudentInfo> getEnrolledStudents() {
        return enrolledStudents;
    }
    
    public void setEnrolledStudents(List<EnrolledStudentInfo> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
    }
    
    public Boolean getIsFull() {
        return isFull;
    }
    
    public void setIsFull(Boolean isFull) {
        this.isFull = isFull;
    }
    
    public Boolean getCanEnroll() {
        return canEnroll;
    }
    
    public void setCanEnroll(Boolean canEnroll) {
        this.canEnroll = canEnroll;
    }
    
    @Override
    public String toString() {
        return "CourseResponse{" +
                "id=" + id +
                ", courseCode='" + courseCode + '\'' +
                ", courseName='" + courseName + '\'' +
                ", credits=" + credits +
                ", department='" + department + '\'' +
                ", semester=" + semester +
                ", currentEnrollment=" + currentEnrollment +
                ", maxCapacity=" + maxCapacity +
                ", availableSpots=" + availableSpots +
                ", isActive=" + isActive +
                ", enrollmentOpen=" + enrollmentOpen +
                ", instructorName='" + instructorName + '\'' +
                ", isFull=" + isFull +
                ", canEnroll=" + canEnroll +
                '}';
    }
} 