package com.erp.course.backend.service;

import com.erp.course.backend.entity.Instructor;
import com.erp.course.backend.entity.User;
import com.erp.course.backend.entity.Role;
import com.erp.course.backend.dto.InstructorRequest;
import com.erp.course.backend.dto.InstructorResponse;
import com.erp.course.backend.repository.InstructorRepository;
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
public class InstructorService {
    
    @Autowired
    private InstructorRepository instructorRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<InstructorResponse> getAllInstructors() {
        return instructorRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<InstructorResponse> getAllActiveInstructors() {
        return instructorRepository.findByIsActiveTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<InstructorResponse> getInstructorById(Long id) {
        return instructorRepository.findById(id)
                .map(this::convertToResponse);
    }
    
    public InstructorResponse getInstructorByIdOrThrow(Long id) {
        return instructorRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + id));
    }
    
    public Optional<InstructorResponse> getInstructorByEmployeeId(String employeeId) {
        return instructorRepository.findByEmployeeId(employeeId)
                .map(this::convertToResponse);
    }
    
    public List<InstructorResponse> getInstructorsByDepartment(String department) {
        return instructorRepository.findByDepartmentAndIsActiveTrue(department).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<InstructorResponse> searchInstructorsByName(String name) {
        return instructorRepository.findActiveInstructorsByNameContaining(name).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<String> getAllDepartments() {
        return instructorRepository.findAllActiveDepartments();
    }
    
    public List<String> getAllSpecializations() {
        return instructorRepository.findAllActiveSpecializations();
    }
    
    public InstructorResponse createInstructor(InstructorRequest request) {
        if (instructorRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists: " + request.getEmployeeId());
        }
        
        if (instructorRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        
        // Check if username already exists
        String username = request.getEmployeeId().toLowerCase();
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists: " + username);
        }
        
        // Create instructor record
        Instructor instructor = convertToEntity(request);
        Instructor savedInstructor = instructorRepository.save(instructor);
        
        // Create user account for login
        User user = new User();
        user.setUsername(username);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode("instructor123")); // Default password
        user.setRole(Role.INSTRUCTOR);
        user.setIsActive(true);
        userRepository.save(user);
        
        return convertToResponse(savedInstructor);
    }
    
    public InstructorResponse updateInstructor(Long id, InstructorRequest request) {
        return instructorRepository.findById(id)
                .map(instructor -> {
                    // Check if employee ID is being changed and if it already exists
                    if (!instructor.getEmployeeId().equals(request.getEmployeeId()) && 
                        instructorRepository.existsByEmployeeId(request.getEmployeeId())) {
                        throw new RuntimeException("Employee ID already exists: " + request.getEmployeeId());
                    }
                    
                    // Check if email is being changed and if it already exists
                    if (!instructor.getEmail().equals(request.getEmail()) && 
                        instructorRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists: " + request.getEmail());
                    }
                    
                    updateInstructorFields(instructor, request);
                    Instructor updatedInstructor = instructorRepository.save(instructor);
                    return convertToResponse(updatedInstructor);
                })
                .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + id));
    }
    
    public void deleteInstructor(Long id) {
        instructorRepository.findById(id)
                .map(instructor -> {
                    instructor.setIsActive(false);
                    Instructor updatedInstructor = instructorRepository.save(instructor);
                    
                    // Also deactivate the user account
                    String username = instructor.getEmployeeId().toLowerCase();
                    userRepository.findByUsername(username)
                            .ifPresent(user -> {
                                user.setIsActive(false);
                                userRepository.save(user);
                            });
                    
                    return updatedInstructor;
                })
                .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + id));
    }
    
    public void permanentDeleteInstructor(Long id) {
        if (!instructorRepository.existsById(id)) {
            throw new RuntimeException("Instructor not found with id: " + id);
        }
        instructorRepository.deleteById(id);
    }
    
    public InstructorResponse activateInstructor(Long id) {
        return instructorRepository.findById(id)
                .map(instructor -> {
                    instructor.setIsActive(true);
                    Instructor updatedInstructor = instructorRepository.save(instructor);
                    return convertToResponse(updatedInstructor);
                })
                .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + id));
    }
    
    public long getActiveInstructorCount() {
        return instructorRepository.countActiveInstructors();
    }
    
    public long getInstructorCountByDepartment(String department) {
        return instructorRepository.countByDepartmentAndActive(department);
    }
    
    public InstructorResponse getInstructorByEmail(String email) {
        return instructorRepository.findByEmail(email)
                .map(this::convertToResponse)
                .orElseThrow(() -> new RuntimeException("Instructor not found with email: " + email));
    }
    
    private Instructor convertToEntity(InstructorRequest request) {
        Instructor instructor = new Instructor();
        instructor.setEmployeeId(request.getEmployeeId());
        instructor.setFirstName(request.getFirstName());
        instructor.setLastName(request.getLastName());
        instructor.setEmail(request.getEmail());
        instructor.setPhoneNumber(request.getPhoneNumber());
        instructor.setDepartment(request.getDepartment());
        instructor.setSpecialization(request.getSpecialization());
        instructor.setQualification(request.getQualification());
        instructor.setHireDate(request.getHireDate());
        instructor.setSalary(request.getSalary());
        instructor.setAddress(request.getAddress());
        instructor.setIsActive(request.getIsActive());
        return instructor;
    }
    
    private void updateInstructorFields(Instructor instructor, InstructorRequest request) {
        instructor.setEmployeeId(request.getEmployeeId());
        instructor.setFirstName(request.getFirstName());
        instructor.setLastName(request.getLastName());
        instructor.setEmail(request.getEmail());
        instructor.setPhoneNumber(request.getPhoneNumber());
        instructor.setDepartment(request.getDepartment());
        instructor.setSpecialization(request.getSpecialization());
        instructor.setQualification(request.getQualification());
        instructor.setHireDate(request.getHireDate());
        instructor.setSalary(request.getSalary());
        instructor.setAddress(request.getAddress());
        instructor.setIsActive(request.getIsActive());
    }
    
    private InstructorResponse convertToResponse(Instructor instructor) {
        return new InstructorResponse(
                instructor.getId(),
                instructor.getEmployeeId(),
                instructor.getFirstName(),
                instructor.getLastName(),
                instructor.getEmail(),
                instructor.getPhoneNumber(),
                instructor.getDepartment(),
                instructor.getSpecialization(),
                instructor.getQualification(),
                instructor.getHireDate(),
                instructor.getSalary(),
                instructor.getAddress(),
                instructor.getIsActive(),
                instructor.getCreatedAt(),
                instructor.getUpdatedAt()
        );
    }
} 