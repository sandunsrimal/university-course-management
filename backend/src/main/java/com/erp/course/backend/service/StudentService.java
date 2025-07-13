package com.erp.course.backend.service;

import com.erp.course.backend.entity.Student;
import com.erp.course.backend.entity.User;
import com.erp.course.backend.entity.Role;
import com.erp.course.backend.dto.StudentRequest;
import com.erp.course.backend.dto.StudentResponse;
import com.erp.course.backend.repository.StudentRepository;
import com.erp.course.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<StudentResponse> getAllActiveStudents() {
        return studentRepository.findByIsActiveTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<StudentResponse> getStudentById(Long id) {
        return studentRepository.findById(id)
                .map(this::convertToResponse);
    }
    
    public Optional<StudentResponse> getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId)
                .map(this::convertToResponse);
    }
    
    public StudentResponse getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .map(this::convertToResponse)
                .orElse(null);
    }
    
    public StudentResponse getStudentByIdOrThrow(Long id) {
        return studentRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }
    
    public List<StudentResponse> getStudentsByMajor(String major) {
        return studentRepository.findByMajorAndIsActiveTrue(major).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<StudentResponse> getStudentsByYear(Integer year) {
        return studentRepository.findByYearAndIsActiveTrue(year).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<StudentResponse> getStudentsByStatus(String status) {
        return studentRepository.findByStatusAndIsActiveTrue(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<StudentResponse> getStudentsByMajorAndYear(String major, Integer year) {
        return studentRepository.findByMajorAndYear(major, year).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<StudentResponse> searchStudentsByName(String name) {
        return studentRepository.findActiveStudentsByNameContaining(name).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<String> getAllMajors() {
        return studentRepository.findAllActiveMajors();
    }
    
    public List<String> getAllStatuses() {
        return studentRepository.findAllActiveStatuses();
    }
    
    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByStudentId(request.getStudentId())) {
            throw new RuntimeException("Student ID already exists: " + request.getStudentId());
        }
        
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        
        // Check if username already exists
        String username = request.getStudentId().toLowerCase();
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists: " + username);
        }
        
        // Create student record
        Student student = convertToEntity(request);
        Student savedStudent = studentRepository.save(student);
        
        // Create user account for login
        User user = new User();
        user.setUsername(username);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode("student123")); // Default password
        user.setRole(Role.STUDENT);
        user.setIsActive(true);
        userRepository.save(user);
        
        return convertToResponse(savedStudent);
    }
    
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        return studentRepository.findById(id)
                .map(student -> {
                    // Check if student ID is being changed and if it already exists
                    if (!student.getStudentId().equals(request.getStudentId()) && 
                        studentRepository.existsByStudentId(request.getStudentId())) {
                        throw new RuntimeException("Student ID already exists: " + request.getStudentId());
                    }
                    
                    // Check if email is being changed and if it already exists
                    if (!student.getEmail().equals(request.getEmail()) && 
                        studentRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists: " + request.getEmail());
                    }
                    
                    updateStudentFields(student, request);
                    Student updatedStudent = studentRepository.save(student);
                    return convertToResponse(updatedStudent);
                })
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }
    
    public void deleteStudent(Long id) {
        studentRepository.findById(id)
                .map(student -> {
                    student.setIsActive(false);
                    Student updatedStudent = studentRepository.save(student);
                    
                    // Also deactivate the user account
                    String username = student.getStudentId().toLowerCase();
                    userRepository.findByUsername(username)
                            .ifPresent(user -> {
                                user.setIsActive(false);
                                userRepository.save(user);
                            });
                    
                    return updatedStudent;
                })
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }
    
    public void permanentDeleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }
    
    public StudentResponse activateStudent(Long id) {
        return studentRepository.findById(id)
                .map(student -> {
                    student.setIsActive(true);
                    Student updatedStudent = studentRepository.save(student);
                    return convertToResponse(updatedStudent);
                })
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }
    
    public long getActiveStudentCount() {
        return studentRepository.countActiveStudents();
    }
    
    public long getStudentCountByMajor(String major) {
        return studentRepository.countByMajorAndActive(major);
    }
    
    public long getStudentCountByYear(Integer year) {
        return studentRepository.countByYearAndActive(year);
    }
    
    public long getStudentCountByStatus(String status) {
        return studentRepository.countByStatusAndActive(status);
    }
    
    public Double getAverageGpa() {
        return studentRepository.findAverageGpa();
    }
    
    public Double getAverageGpaByMajor(String major) {
        return studentRepository.findAverageGpaByMajor(major);
    }
    
    private Student convertToEntity(StudentRequest request) {
        Student student = new Student();
        student.setStudentId(request.getStudentId());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setMajor(request.getMajor());
        student.setYear(request.getYear());
        student.setEnrollmentDate(request.getEnrollmentDate());
        student.setGraduationDate(request.getGraduationDate());
        student.setGpa(request.getGpa());
        student.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        student.setAddress(request.getAddress());
        student.setParentGuardianName(request.getParentGuardianName());
        student.setParentGuardianPhone(request.getParentGuardianPhone());
        student.setEmergencyContact(request.getEmergencyContact());
        student.setEmergencyPhone(request.getEmergencyPhone());
        student.setIsActive(request.getIsActive());
        return student;
    }
    
    private void updateStudentFields(Student student, StudentRequest request) {
        student.setStudentId(request.getStudentId());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setMajor(request.getMajor());
        student.setYear(request.getYear());
        student.setEnrollmentDate(request.getEnrollmentDate());
        student.setGraduationDate(request.getGraduationDate());
        student.setGpa(request.getGpa());
        student.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        student.setAddress(request.getAddress());
        student.setParentGuardianName(request.getParentGuardianName());
        student.setParentGuardianPhone(request.getParentGuardianPhone());
        student.setEmergencyContact(request.getEmergencyContact());
        student.setEmergencyPhone(request.getEmergencyPhone());
        student.setIsActive(request.getIsActive());
    }
    
    private StudentResponse convertToResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getStudentId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getPhoneNumber(),
                student.getDateOfBirth(),
                student.getGender(),
                student.getMajor(),
                student.getYear(),
                student.getEnrollmentDate(),
                student.getGraduationDate(),
                student.getGpa(),
                student.getStatus(),
                student.getAddress(),
                student.getParentGuardianName(),
                student.getParentGuardianPhone(),
                student.getEmergencyContact(),
                student.getEmergencyPhone(),
                student.getIsActive(),
                student.getCreatedAt(),
                student.getUpdatedAt()
        );
    }
} 