package com.erp.course.backend.service;

import com.erp.course.backend.entity.Course;
import com.erp.course.backend.entity.Instructor;
import com.erp.course.backend.entity.Student;
import com.erp.course.backend.dto.CourseRequest;
import com.erp.course.backend.dto.CourseResponse;
import com.erp.course.backend.dto.StudentResponse;
import com.erp.course.backend.repository.CourseRepository;
import com.erp.course.backend.repository.InstructorRepository;
import com.erp.course.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private InstructorRepository instructorRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    // ================================
    // BASIC CRUD OPERATIONS
    // ================================
    
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CourseResponse> getAllActiveCourses() {
        return courseRepository.findByIsActiveTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<CourseResponse> getCourseById(Long id) {
        return courseRepository.findById(id)
                .map(this::convertToResponse);
    }
    
    public CourseResponse getCourseByIdOrThrow(Long id) {
        return courseRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }
    
    public Optional<CourseResponse> getCourseByCourseCode(String courseCode) {
        return courseRepository.findByCourseCode(courseCode)
                .map(this::convertToResponse);
    }
    
    public CourseResponse createCourse(CourseRequest request) {
        // Validate course code uniqueness
        if (courseRepository.existsByCourseCode(request.getCourseCode())) {
            throw new RuntimeException("Course code already exists: " + request.getCourseCode());
        }
        
        // Validate instructor exists
        Instructor instructor = instructorRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + request.getInstructorId()));
        
        // Validate dates
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date must be after start date");
        }
        
        Course course = convertToEntity(request);
        course.setInstructor(instructor);
        
        Course savedCourse = courseRepository.save(course);
        return convertToResponse(savedCourse);
    }
    
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        // Validate course code uniqueness (exclude current course)
        if (courseRepository.existsByCourseCodeAndIdNot(request.getCourseCode(), id)) {
            throw new RuntimeException("Course code already exists: " + request.getCourseCode());
        }
        
        // Validate instructor exists
        Instructor instructor = instructorRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + request.getInstructorId()));
        
        // Validate dates
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date must be after start date");
        }
        
        updateCourseFields(existingCourse, request);
        existingCourse.setInstructor(instructor);
        
        Course updatedCourse = courseRepository.save(existingCourse);
        return convertToResponse(updatedCourse);
    }
    
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        // Check if course has enrolled students
        if (!course.getEnrolledStudents().isEmpty()) {
            throw new RuntimeException("Cannot delete course with enrolled students. Please remove all students first.");
        }
        
        course.setIsActive(false);
        courseRepository.save(course);
    }
    
    public void permanentDeleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        // Check if course has enrolled students
        if (!course.getEnrolledStudents().isEmpty()) {
            throw new RuntimeException("Cannot permanently delete course with enrolled students. Please remove all students first.");
        }
        
        courseRepository.delete(course);
    }
    
    public CourseResponse activateCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        course.setIsActive(true);
        Course updatedCourse = courseRepository.save(course);
        return convertToResponse(updatedCourse);
    }
    
    // ================================
    // SEARCH AND FILTER OPERATIONS
    // ================================
    
    public List<CourseResponse> getCoursesByDepartment(String department) {
        return courseRepository.findByDepartmentAndIsActiveTrue(department).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CourseResponse> getCoursesBySemester(Integer semester) {
        return courseRepository.findBySemesterAndIsActiveTrue(semester).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CourseResponse> getCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CourseResponse> getActiveCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorIdAndIsActiveTrue(instructorId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CourseResponse> searchCoursesByNameOrCode(String searchTerm) {
        return courseRepository.searchCoursesByNameOrCode(searchTerm).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CourseResponse> getCoursesWithAvailableSpots() {
        return courseRepository.findCoursesWithAvailableSpots().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CourseResponse> getCoursesWithOpenEnrollment() {
        return courseRepository.findByEnrollmentOpenTrueAndIsActiveTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // ================================
    // ENROLLMENT OPERATIONS
    // ================================
    
    public CourseResponse enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        // Validate enrollment conditions
        if (!course.getIsActive()) {
            throw new RuntimeException("Cannot enroll in inactive course");
        }
        
        if (!course.getEnrollmentOpen()) {
            throw new RuntimeException("Enrollment is closed for this course");
        }
        
        if (course.isFull()) {
            throw new RuntimeException("Course is full");
        }
        
        // Check if student is already enrolled
        if (course.getEnrolledStudents().contains(student)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }
        
        // Enroll the student
        course.enrollStudent(student);
        Course updatedCourse = courseRepository.save(course);
        return convertToResponse(updatedCourse);
    }
    
    public CourseResponse removeStudentFromCourse(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        // Check if student is enrolled
        if (!course.getEnrolledStudents().contains(student)) {
            throw new RuntimeException("Student is not enrolled in this course");
        }
        
        // Remove the student
        course.removeStudent(student);
        Course updatedCourse = courseRepository.save(course);
        return convertToResponse(updatedCourse);
    }
    
    public List<CourseResponse> getCoursesForStudent(Long studentId) {
        return courseRepository.findCoursesByEnrolledStudent(studentId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CourseResponse> getAvailableCoursesForStudent(Long studentId) {
        return courseRepository.findAvailableCoursesForStudent(studentId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public boolean isStudentEnrolledInCourse(Long studentId, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        return course.getEnrolledStudents().contains(student);
    }
    
    // ================================
    // ENROLLMENT MANAGEMENT
    // ================================
    
    public CourseResponse openEnrollment(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        course.setEnrollmentOpen(true);
        Course updatedCourse = courseRepository.save(course);
        return convertToResponse(updatedCourse);
    }
    
    public CourseResponse closeEnrollment(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        course.setEnrollmentOpen(false);
        Course updatedCourse = courseRepository.save(course);
        return convertToResponse(updatedCourse);
    }
    
    // ================================
    // UTILITY AND STATISTICS
    // ================================
    
    public List<String> getAllDepartments() {
        return courseRepository.findDistinctDepartments();
    }
    
    public List<Integer> getAllSemesters() {
        return courseRepository.findDistinctSemesters();
    }
    
    public long getActiveCourseCount() {
        return courseRepository.countByIsActiveTrue();
    }
    
    public long getCourseCountByDepartment(String department) {
        return courseRepository.countCoursesByDepartment(department);
    }
    
    public long getCourseCountBySemester(Integer semester) {
        return courseRepository.countCoursesBySemester(semester);
    }
    
    public long getCourseCountByInstructor(Long instructorId) {
        return courseRepository.countCoursesByInstructor(instructorId);
    }
    
    public long getTotalEnrollment() {
        Long total = courseRepository.getTotalEnrollment();
        return total != null ? total : 0L;
    }
    
    public long getTotalCapacity() {
        Long total = courseRepository.getTotalCapacity();
        return total != null ? total : 0L;
    }
    
    public long getActiveCourseCountByInstructor(Long instructorId) {
        return courseRepository.countByInstructorIdAndIsActiveTrue(instructorId);
    }
    
    public long getTotalStudentCountByInstructor(Long instructorId) {
        Long total = courseRepository.getTotalStudentCountByInstructor(instructorId);
        return total != null ? total : 0L;
    }
    
    public double getAverageEnrollmentByInstructor(Long instructorId) {
        Double average = courseRepository.getAverageEnrollmentByInstructor(instructorId);
        return average != null ? average : 0.0;
    }
    
    public List<StudentResponse> getStudentsInCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        return course.getEnrolledStudents().stream()
                .map(this::convertStudentToResponse)
                .collect(Collectors.toList());
    }
    
    // ================================
    // CONVERSION METHODS
    // ================================
    
    private Course convertToEntity(CourseRequest request) {
        Course course = new Course();
        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());
        course.setDepartment(request.getDepartment());
        course.setSemester(request.getSemester());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setSchedule(request.getSchedule());
        course.setLocation(request.getLocation());
        course.setMaxCapacity(request.getMaxCapacity());
        course.setEnrollmentOpen(request.getEnrollmentOpen() != null ? request.getEnrollmentOpen() : true);
        return course;
    }
    
    private void updateCourseFields(Course course, CourseRequest request) {
        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());
        course.setDepartment(request.getDepartment());
        course.setSemester(request.getSemester());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setSchedule(request.getSchedule());
        course.setLocation(request.getLocation());
        course.setMaxCapacity(request.getMaxCapacity());
        course.setEnrollmentOpen(request.getEnrollmentOpen() != null ? request.getEnrollmentOpen() : true);
    }
    
    private CourseResponse convertToResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setCourseCode(course.getCourseCode());
        response.setCourseName(course.getCourseName());
        response.setDescription(course.getDescription());
        response.setCredits(course.getCredits());
        response.setDepartment(course.getDepartment());
        response.setSemester(course.getSemester());
        response.setStartDate(course.getStartDate());
        response.setEndDate(course.getEndDate());
        response.setSchedule(course.getSchedule());
        response.setLocation(course.getLocation());
        response.setMaxCapacity(course.getMaxCapacity());
        response.setCurrentEnrollment(course.getCurrentEnrollment());
        response.setAvailableSpots(course.getAvailableSpots());
        response.setIsActive(course.getIsActive());
        response.setEnrollmentOpen(course.getEnrollmentOpen());
        response.setCreatedAt(course.getCreatedAt());
        response.setUpdatedAt(course.getUpdatedAt());
        response.setIsFull(course.isFull());
        response.setCanEnroll(course.canEnroll());
        
        // Set instructor information
        if (course.getInstructor() != null) {
            response.setInstructorId(course.getInstructor().getId());
            response.setInstructorName(course.getInstructor().getFullName());
            response.setInstructorEmail(course.getInstructor().getEmail());
            response.setInstructorDepartment(course.getInstructor().getDepartment());
        }
        
        // Set enrolled students information
        if (course.getEnrolledStudents() != null) {
            List<CourseResponse.EnrolledStudentInfo> enrolledStudents = course.getEnrolledStudents().stream()
                    .map(student -> new CourseResponse.EnrolledStudentInfo(
                            student.getId(),
                            student.getStudentId(),
                            student.getFullName(),
                            student.getEmail(),
                            student.getMajor(),
                            student.getYear()
                    ))
                    .collect(Collectors.toList());
            response.setEnrolledStudents(enrolledStudents);
        }
        
        return response;
    }
    
    private StudentResponse convertStudentToResponse(Student student) {
        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setStudentId(student.getStudentId());
        response.setFirstName(student.getFirstName());
        response.setLastName(student.getLastName());
        response.setEmail(student.getEmail());
        response.setPhoneNumber(student.getPhoneNumber());
        response.setDateOfBirth(student.getDateOfBirth());
        response.setGender(student.getGender());
        response.setMajor(student.getMajor());
        response.setYear(student.getYear());
        response.setEnrollmentDate(student.getEnrollmentDate());
        response.setGraduationDate(student.getGraduationDate());
        response.setGpa(student.getGpa());
        response.setStatus(student.getStatus());
        response.setAddress(student.getAddress());
        response.setParentGuardianName(student.getParentGuardianName());
        response.setParentGuardianPhone(student.getParentGuardianPhone());
        response.setEmergencyContact(student.getEmergencyContact());
        response.setEmergencyPhone(student.getEmergencyPhone());
        response.setIsActive(student.getIsActive());
        response.setCreatedAt(student.getCreatedAt());
        response.setUpdatedAt(student.getUpdatedAt());
        return response;
    }
} 