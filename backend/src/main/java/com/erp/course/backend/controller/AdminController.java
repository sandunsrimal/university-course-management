package com.erp.course.backend.controller;

import com.erp.course.backend.dto.*;
import com.erp.course.backend.service.InstructorService;
import com.erp.course.backend.service.StudentService;
import com.erp.course.backend.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private InstructorService instructorService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private CourseService courseService;
    
    // ================================
    // INSTRUCTOR MANAGEMENT ENDPOINTS
    // ================================
    
    @GetMapping("/instructors")
    public ResponseEntity<List<InstructorResponse>> getAllInstructors() {
        List<InstructorResponse> instructors = instructorService.getAllInstructors();
        return ResponseEntity.ok(instructors);
    }
    
    @GetMapping("/instructors/active")
    public ResponseEntity<List<InstructorResponse>> getActiveInstructors() {
        List<InstructorResponse> instructors = instructorService.getAllActiveInstructors();
        return ResponseEntity.ok(instructors);
    }
    
    @GetMapping("/instructors/{id}")
    public ResponseEntity<InstructorResponse> getInstructorById(@PathVariable Long id) {
        return instructorService.getInstructorById(id)
                .map(instructor -> ResponseEntity.ok(instructor))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/instructors/employee/{employeeId}")
    public ResponseEntity<InstructorResponse> getInstructorByEmployeeId(@PathVariable String employeeId) {
        return instructorService.getInstructorByEmployeeId(employeeId)
                .map(instructor -> ResponseEntity.ok(instructor))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/instructors/department/{department}")
    public ResponseEntity<List<InstructorResponse>> getInstructorsByDepartment(@PathVariable String department) {
        List<InstructorResponse> instructors = instructorService.getInstructorsByDepartment(department);
        return ResponseEntity.ok(instructors);
    }
    
    @GetMapping("/instructors/search")
    public ResponseEntity<List<InstructorResponse>> searchInstructors(@RequestParam String name) {
        List<InstructorResponse> instructors = instructorService.searchInstructorsByName(name);
        return ResponseEntity.ok(instructors);
    }
    
    @GetMapping("/instructors/departments")
    public ResponseEntity<List<String>> getAllDepartments() {
        List<String> departments = instructorService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }
    
    @GetMapping("/instructors/specializations")
    public ResponseEntity<List<String>> getAllSpecializations() {
        List<String> specializations = instructorService.getAllSpecializations();
        return ResponseEntity.ok(specializations);
    }
    
    @PostMapping("/instructors")
    public ResponseEntity<?> createInstructor(@Valid @RequestBody InstructorRequest request) {
        try {
            InstructorResponse instructor = instructorService.createInstructor(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(instructor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/instructors/{id}")
    public ResponseEntity<?> updateInstructor(@PathVariable Long id, @Valid @RequestBody InstructorRequest request) {
        try {
            InstructorResponse instructor = instructorService.updateInstructor(id, request);
            return ResponseEntity.ok(instructor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/instructors/{id}")
    public ResponseEntity<?> deleteInstructor(@PathVariable Long id) {
        try {
            instructorService.deleteInstructor(id);
            return ResponseEntity.ok(new MessageResponse("Instructor deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/instructors/{id}/permanent")
    public ResponseEntity<?> permanentDeleteInstructor(@PathVariable Long id) {
        try {
            instructorService.permanentDeleteInstructor(id);
            return ResponseEntity.ok(new MessageResponse("Instructor permanently deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/instructors/{id}/activate")
    public ResponseEntity<?> activateInstructor(@PathVariable Long id) {
        try {
            InstructorResponse instructor = instructorService.activateInstructor(id);
            return ResponseEntity.ok(instructor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // STUDENT MANAGEMENT ENDPOINTS
    // ================================
    
    @GetMapping("/students")
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        List<StudentResponse> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/students/active")
    public ResponseEntity<List<StudentResponse>> getActiveStudents() {
        List<StudentResponse> students = studentService.getAllActiveStudents();
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/students/{id}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(student -> ResponseEntity.ok(student))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/students/student/{studentId}")
    public ResponseEntity<StudentResponse> getStudentByStudentId(@PathVariable String studentId) {
        return studentService.getStudentByStudentId(studentId)
                .map(student -> ResponseEntity.ok(student))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/students/major/{major}")
    public ResponseEntity<List<StudentResponse>> getStudentsByMajor(@PathVariable String major) {
        List<StudentResponse> students = studentService.getStudentsByMajor(major);
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/students/year/{year}")
    public ResponseEntity<List<StudentResponse>> getStudentsByYear(@PathVariable Integer year) {
        List<StudentResponse> students = studentService.getStudentsByYear(year);
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/students/status/{status}")
    public ResponseEntity<List<StudentResponse>> getStudentsByStatus(@PathVariable String status) {
        List<StudentResponse> students = studentService.getStudentsByStatus(status);
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/students/search")
    public ResponseEntity<List<StudentResponse>> searchStudents(@RequestParam String name) {
        List<StudentResponse> students = studentService.searchStudentsByName(name);
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/students/majors")
    public ResponseEntity<List<String>> getAllMajors() {
        List<String> majors = studentService.getAllMajors();
        return ResponseEntity.ok(majors);
    }
    
    @GetMapping("/students/statuses")
    public ResponseEntity<List<String>> getAllStatuses() {
        List<String> statuses = studentService.getAllStatuses();
        return ResponseEntity.ok(statuses);
    }
    
    @PostMapping("/students")
    public ResponseEntity<?> createStudent(@Valid @RequestBody StudentRequest request) {
        try {
            StudentResponse student = studentService.createStudent(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentRequest request) {
        try {
            StudentResponse student = studentService.updateStudent(id, request);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok(new MessageResponse("Student deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/students/{id}/permanent")
    public ResponseEntity<?> permanentDeleteStudent(@PathVariable Long id) {
        try {
            studentService.permanentDeleteStudent(id);
            return ResponseEntity.ok(new MessageResponse("Student permanently deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/students/{id}/activate")
    public ResponseEntity<?> activateStudent(@PathVariable Long id) {
        try {
            StudentResponse student = studentService.activateStudent(id);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // COURSE MANAGEMENT ENDPOINTS
    // ================================
    
    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/courses/active")
    public ResponseEntity<List<CourseResponse>> getActiveCourses() {
        List<CourseResponse> courses = courseService.getAllActiveCourses();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/courses/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(course -> ResponseEntity.ok(course))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/courses/code/{courseCode}")
    public ResponseEntity<CourseResponse> getCourseByCourseCode(@PathVariable String courseCode) {
        return courseService.getCourseByCourseCode(courseCode)
                .map(course -> ResponseEntity.ok(course))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/courses/department/{department}")
    public ResponseEntity<List<CourseResponse>> getCoursesByDepartment(@PathVariable String department) {
        List<CourseResponse> courses = courseService.getCoursesByDepartment(department);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/courses/semester/{semester}")
    public ResponseEntity<List<CourseResponse>> getCoursesBySemester(@PathVariable Integer semester) {
        List<CourseResponse> courses = courseService.getCoursesBySemester(semester);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/courses/instructor/{instructorId}")
    public ResponseEntity<List<CourseResponse>> getCoursesByInstructor(@PathVariable Long instructorId) {
        List<CourseResponse> courses = courseService.getCoursesByInstructor(instructorId);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/courses/search")
    public ResponseEntity<List<CourseResponse>> searchCourses(@RequestParam String query) {
        List<CourseResponse> courses = courseService.searchCoursesByNameOrCode(query);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/courses/departments")
    public ResponseEntity<List<String>> getCourseDepartments() {
        List<String> departments = courseService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }
    
    @GetMapping("/courses/semesters")
    public ResponseEntity<List<Integer>> getCourseSemesters() {
        List<Integer> semesters = courseService.getAllSemesters();
        return ResponseEntity.ok(semesters);
    }
    
    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseRequest request) {
        try {
            CourseResponse course = courseService.createCourse(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/courses/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        try {
            CourseResponse course = courseService.updateCourse(id, request);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(new MessageResponse("Course deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/courses/{id}/permanent")
    public ResponseEntity<?> permanentDeleteCourse(@PathVariable Long id) {
        try {
            courseService.permanentDeleteCourse(id);
            return ResponseEntity.ok(new MessageResponse("Course permanently deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/courses/{id}/activate")
    public ResponseEntity<?> activateCourse(@PathVariable Long id) {
        try {
            CourseResponse course = courseService.activateCourse(id);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Course enrollment management
    @PostMapping("/courses/{courseId}/enroll/{studentId}")
    public ResponseEntity<?> enrollStudentInCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            CourseResponse course = courseService.enrollStudent(courseId, studentId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/courses/{courseId}/enroll/{studentId}")
    public ResponseEntity<?> removeStudentFromCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            CourseResponse course = courseService.removeStudentFromCourse(courseId, studentId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/courses/{courseId}/enrollment/open")
    public ResponseEntity<?> openEnrollment(@PathVariable Long courseId) {
        try {
            CourseResponse course = courseService.openEnrollment(courseId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/courses/{courseId}/enrollment/close")
    public ResponseEntity<?> closeEnrollment(@PathVariable Long courseId) {
        try {
            CourseResponse course = courseService.closeEnrollment(courseId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ================================
    // STATISTICS AND ANALYTICS
    // ================================
    
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // Instructor statistics
        statistics.put("totalInstructors", instructorService.getActiveInstructorCount());
        
        // Student statistics
        statistics.put("totalStudents", studentService.getActiveStudentCount());
        statistics.put("averageGpa", studentService.getAverageGpa());
        
        // Course statistics
        statistics.put("totalCourses", courseService.getActiveCourseCount());
        statistics.put("totalEnrollment", courseService.getTotalEnrollment());
        statistics.put("totalCapacity", courseService.getTotalCapacity());
        
        // Calculate utilization rate
        long totalEnrollment = courseService.getTotalEnrollment();
        long totalCapacity = courseService.getTotalCapacity();
        double utilizationRate = totalCapacity > 0 ? (double) totalEnrollment / totalCapacity * 100 : 0.0;
        statistics.put("utilizationRate", utilizationRate);
        
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/instructors")
    public ResponseEntity<Map<String, Object>> getInstructorStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("totalInstructors", instructorService.getActiveInstructorCount());
        statistics.put("departments", instructorService.getAllDepartments());
        statistics.put("specializations", instructorService.getAllSpecializations());
        
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/courses")
    public ResponseEntity<Map<String, Object>> getCourseStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("totalCourses", courseService.getActiveCourseCount());
        statistics.put("totalEnrollment", courseService.getTotalEnrollment());
        statistics.put("totalCapacity", courseService.getTotalCapacity());
        
        // Calculate utilization rate
        long totalEnrollment = courseService.getTotalEnrollment();
        long totalCapacity = courseService.getTotalCapacity();
        double utilizationRate = totalCapacity > 0 ? (double) totalEnrollment / totalCapacity * 100 : 0.0;
        statistics.put("utilizationRate", utilizationRate);
        
        statistics.put("totalDepartments", courseService.getAllDepartments().size());
        statistics.put("totalSemesters", courseService.getAllSemesters().size());
        
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/students")
    public ResponseEntity<Map<String, Object>> getStudentStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("totalStudents", studentService.getActiveStudentCount());
        statistics.put("majors", studentService.getAllMajors());
        statistics.put("statuses", studentService.getAllStatuses());
        statistics.put("averageGpa", studentService.getAverageGpa());
        
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/students/major/{major}")
    public ResponseEntity<Map<String, Object>> getStudentStatisticsByMajor(@PathVariable String major) {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("totalStudents", studentService.getStudentCountByMajor(major));
        statistics.put("averageGpa", studentService.getAverageGpaByMajor(major));
        
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/students/year/{year}")
    public ResponseEntity<Map<String, Object>> getStudentStatisticsByYear(@PathVariable Integer year) {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("totalStudents", studentService.getStudentCountByYear(year));
        
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/instructors/department/{department}")
    public ResponseEntity<Map<String, Object>> getInstructorStatisticsByDepartment(@PathVariable String department) {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("totalInstructors", instructorService.getInstructorCountByDepartment(department));
        
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/courses/department/{department}")
    public ResponseEntity<Map<String, Object>> getCourseStatisticsByDepartment(@PathVariable String department) {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("department", department);
        statistics.put("courseCount", courseService.getCourseCountByDepartment(department));
        
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/courses/semester/{semester}")
    public ResponseEntity<Map<String, Object>> getCourseStatisticsBySemester(@PathVariable Integer semester) {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("semester", semester);
        statistics.put("courseCount", courseService.getCourseCountBySemester(semester));
        
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/courses/instructor/{instructorId}")
    public ResponseEntity<Map<String, Object>> getCourseStatisticsByInstructor(@PathVariable Long instructorId) {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("instructorId", instructorId);
        statistics.put("courseCount", courseService.getCourseCountByInstructor(instructorId));
        
        return ResponseEntity.ok(statistics);
    }
} 