package com.erp.course.backend.config;

import com.erp.course.backend.entity.Role;
import com.erp.course.backend.entity.User;
import com.erp.course.backend.entity.Instructor;
import com.erp.course.backend.entity.Student;
import com.erp.course.backend.repository.UserRepository;
import com.erp.course.backend.repository.InstructorRepository;
import com.erp.course.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private InstructorRepository instructorRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        seedDefaultUsers();
        seedDefaultInstructors();
        seedDefaultStudents();
    }
    
    private void seedDefaultUsers() {
        // Create default admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setEmail("admin@university.edu");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Default admin user created - Username: admin, Password: admin123");
        }
        
        // Create default instructor user
        if (!userRepository.existsByUsername("instructor")) {
            User instructor = new User();
            instructor.setUsername("instructor");
            instructor.setFirstName("John");
            instructor.setLastName("Smith");
            instructor.setEmail("instructor@university.edu");
            instructor.setPassword(passwordEncoder.encode("instructor123"));
            instructor.setRole(Role.INSTRUCTOR);
            userRepository.save(instructor);
            System.out.println("Default instructor user created - Username: instructor, Password: instructor123");
        }
        
        // Create default student user
        if (!userRepository.existsByUsername("student")) {
            User student = new User();
            student.setUsername("student");
            student.setFirstName("Jane");
            student.setLastName("Doe");
            student.setEmail("student@university.edu");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setRole(Role.STUDENT);
            userRepository.save(student);
            System.out.println("Default student user created - Username: student, Password: student123");
        }
    }
    
    private void seedDefaultInstructors() {
        // Create default instructor profile
        if (!instructorRepository.existsByEmail("instructor@university.edu")) {
            Instructor instructor = new Instructor();
            instructor.setEmployeeId("EMP001");
            instructor.setFirstName("John");
            instructor.setLastName("Smith");
            instructor.setEmail("instructor@university.edu");
            instructor.setPhoneNumber("+1-555-0101");
            instructor.setDepartment("Computer Science");
            instructor.setSpecialization("Software Engineering");
            instructor.setQualification("PhD in Computer Science");
            instructor.setHireDate(LocalDate.of(2020, 1, 15));
            instructor.setSalary(BigDecimal.valueOf(75000.0));
            instructor.setAddress("123 University Ave, Academic City, AC 12345");
            instructor.setIsActive(true);
            instructorRepository.save(instructor);
            System.out.println("Default instructor profile created - Email: instructor@university.edu");
        }
        
        // Create additional instructor
        if (!instructorRepository.existsByEmail("jane.doe@university.edu")) {
            Instructor instructor2 = new Instructor();
            instructor2.setEmployeeId("EMP002");
            instructor2.setFirstName("Jane");
            instructor2.setLastName("Doe");
            instructor2.setEmail("jane.doe@university.edu");
            instructor2.setPhoneNumber("+1-555-0102");
            instructor2.setDepartment("Mathematics");
            instructor2.setSpecialization("Applied Mathematics");
            instructor2.setQualification("PhD in Mathematics");
            instructor2.setHireDate(LocalDate.of(2019, 8, 20));
            instructor2.setSalary(BigDecimal.valueOf(72000.0));
            instructor2.setAddress("456 Faculty St, Academic City, AC 12345");
            instructor2.setIsActive(true);
            instructorRepository.save(instructor2);
            System.out.println("Additional instructor profile created - Email: jane.doe@university.edu");
        }
    }
    
    private void seedDefaultStudents() {
        // Create default student profile
        if (!studentRepository.existsByEmail("student@university.edu")) {
            Student student = new Student();
            student.setStudentId("STU001");
            student.setFirstName("Jane");
            student.setLastName("Doe");
            student.setEmail("student@university.edu");
            student.setPhoneNumber("+1-555-0201");
            student.setDateOfBirth(LocalDate.of(2000, 5, 15));
            student.setGender("Female");
            student.setMajor("Computer Science");
            student.setYear(2);
            student.setEnrollmentDate(LocalDate.of(2022, 9, 1));
            student.setGraduationDate(LocalDate.of(2026, 5, 15));
            student.setGpa(BigDecimal.valueOf(3.75));
            student.setStatus("Active");
            student.setAddress("789 Student Ln, Academic City, AC 12345");
            student.setParentGuardianName("Robert Doe");
            student.setParentGuardianPhone("+1-555-0202");
            student.setEmergencyContact("Mary Doe");
            student.setEmergencyPhone("+1-555-0203");
            student.setIsActive(true);
            studentRepository.save(student);
            System.out.println("Default student profile created - Email: student@university.edu");
        }
        
        // Create additional student
        if (!studentRepository.existsByEmail("bob.smith@university.edu")) {
            Student student2 = new Student();
            student2.setStudentId("STU002");
            student2.setFirstName("Bob");
            student2.setLastName("Smith");
            student2.setEmail("bob.smith@university.edu");
            student2.setPhoneNumber("+1-555-0204");
            student2.setDateOfBirth(LocalDate.of(1999, 12, 10));
            student2.setGender("Male");
            student2.setMajor("Mathematics");
            student2.setYear(3);
            student2.setEnrollmentDate(LocalDate.of(2021, 9, 1));
            student2.setGraduationDate(LocalDate.of(2025, 5, 15));
            student2.setGpa(BigDecimal.valueOf(3.60));
            student2.setStatus("Active");
            student2.setAddress("321 Scholar Dr, Academic City, AC 12345");
            student2.setParentGuardianName("John Smith");
            student2.setParentGuardianPhone("+1-555-0205");
            student2.setEmergencyContact("Susan Smith");
            student2.setEmergencyPhone("+1-555-0206");
            student2.setIsActive(true);
            studentRepository.save(student2);
            System.out.println("Additional student profile created - Email: bob.smith@university.edu");
        }
    }
} 