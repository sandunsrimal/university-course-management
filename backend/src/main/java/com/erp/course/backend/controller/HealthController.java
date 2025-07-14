package com.erp.course.backend.controller;

import com.erp.course.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Application is running");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> root() {
        Map<String, String> response = new HashMap<>();
        response.put("service", "University Course Management Backend");
        response.put("status", "UP");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    // Temporary endpoint to check database users - REMOVE AFTER DEBUGGING
    @GetMapping("/debug/users")
    public ResponseEntity<Map<String, Object>> checkUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            long userCount = userRepository.count();
            response.put("totalUsers", userCount);
            response.put("adminExists", userRepository.existsByUsername("admin"));
            response.put("instructorExists", userRepository.existsByUsername("instructor"));
            response.put("studentExists", userRepository.existsByUsername("student"));
            response.put("status", "SUCCESS");
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    // Endpoint to create default users if they don't exist
    @GetMapping("/debug/init-users")
    public ResponseEntity<Map<String, Object>> initUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Check and create admin user
            if (!userRepository.existsByUsername("admin")) {
                com.erp.course.backend.entity.User admin = new com.erp.course.backend.entity.User();
                admin.setUsername("admin");
                admin.setFirstName("System");
                admin.setLastName("Administrator");
                admin.setEmail("admin@university.edu");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(com.erp.course.backend.entity.Role.ADMIN);
                userRepository.save(admin);
                response.put("adminCreated", true);
            } else {
                response.put("adminCreated", false);
                response.put("adminMessage", "Admin already exists");
            }

            // Check and create instructor user
            if (!userRepository.existsByUsername("instructor")) {
                com.erp.course.backend.entity.User instructor = new com.erp.course.backend.entity.User();
                instructor.setUsername("instructor");
                instructor.setFirstName("John");
                instructor.setLastName("Smith");
                instructor.setEmail("instructor@university.edu");
                instructor.setPassword(passwordEncoder.encode("instructor123"));
                instructor.setRole(com.erp.course.backend.entity.Role.INSTRUCTOR);
                userRepository.save(instructor);
                response.put("instructorCreated", true);
            } else {
                response.put("instructorCreated", false);
                response.put("instructorMessage", "Instructor already exists");
            }

            // Check and create student user
            if (!userRepository.existsByUsername("student")) {
                com.erp.course.backend.entity.User student = new com.erp.course.backend.entity.User();
                student.setUsername("student");
                student.setFirstName("Jane");
                student.setLastName("Doe");
                student.setEmail("student@university.edu");
                student.setPassword(passwordEncoder.encode("student123"));
                student.setRole(com.erp.course.backend.entity.Role.STUDENT);
                userRepository.save(student);
                response.put("studentCreated", true);
            } else {
                response.put("studentCreated", false);
                response.put("studentMessage", "Student already exists");
            }

            // Final count
            response.put("totalUsers", userRepository.count());
            response.put("status", "SUCCESS");

        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("error", e.getMessage());
            response.put("stackTrace", e.getStackTrace()[0].toString());
        }
        return ResponseEntity.ok(response);
    }
} 