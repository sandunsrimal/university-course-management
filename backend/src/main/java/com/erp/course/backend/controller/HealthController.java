package com.erp.course.backend.controller;

import com.erp.course.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

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

    // QUICK FIX: Activate all users and ensure they can login
    @GetMapping("/debug/fix-login")
    public ResponseEntity<Map<String, Object>> fixLogin() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Get all users
            List<com.erp.course.backend.entity.User> allUsers = userRepository.findAll();
            
            for (com.erp.course.backend.entity.User user : allUsers) {
                // Make sure isActive is set to true
                user.setIsActive(true);
                userRepository.save(user);
            }
            
            response.put("usersFixed", allUsers.size());
            response.put("adminExists", userRepository.existsByUsername("admin"));
            response.put("totalUsers", userRepository.count());
            response.put("status", "SUCCESS");
            response.put("message", "All users activated and ready for login");
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("error", e.getMessage());
        }
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

    // Debug endpoint to check user details and password encoding
    @GetMapping("/debug/user-details")
    public ResponseEntity<Map<String, Object>> getUserDetails() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Check admin user details
            if (userRepository.existsByUsername("admin")) {
                com.erp.course.backend.entity.User admin = userRepository.findByUsernameAndIsActiveTrue("admin").orElse(null);
                if (admin != null) {
                    Map<String, Object> adminDetails = new HashMap<>();
                    adminDetails.put("username", admin.getUsername());
                    adminDetails.put("email", admin.getEmail());
                    adminDetails.put("role", admin.getRole().toString());
                    adminDetails.put("isActive", admin.getIsActive());
                    adminDetails.put("passwordLength", admin.getPassword().length());
                    adminDetails.put("passwordStartsWith", admin.getPassword().substring(0, Math.min(10, admin.getPassword().length())));
                    adminDetails.put("passwordMatches", passwordEncoder.matches("admin123", admin.getPassword()));
                    response.put("adminDetails", adminDetails);
                } else {
                    response.put("adminDetails", "User exists but not found when querying");
                }
            } else {
                response.put("adminDetails", "Admin user does not exist");
            }

            response.put("status", "SUCCESS");
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("error", e.getMessage());
            response.put("stackTrace", java.util.Arrays.toString(e.getStackTrace()));
        }
                 return ResponseEntity.ok(response);
    }

    // Debug endpoint to test the actual authentication process
    @GetMapping("/debug/test-auth")
    public ResponseEntity<Map<String, Object>> testAuth() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Test the UserDetailsService directly
            com.erp.course.backend.service.UserDetailsServiceImpl userDetailsService = 
                new com.erp.course.backend.service.UserDetailsServiceImpl();
            
            // Check if we can load the user
            com.erp.course.backend.entity.User user = userRepository.findByUsernameAndIsActiveTrue("admin").orElse(null);
            if (user != null) {
                response.put("userFound", true);
                response.put("userClass", user.getClass().getSimpleName());
                response.put("userAuthorities", user.getAuthorities().toString());
                response.put("userEnabled", user.isEnabled());
                response.put("userAccountNonExpired", user.isAccountNonExpired());
                response.put("userAccountNonLocked", user.isAccountNonLocked());
                response.put("userCredentialsNonExpired", user.isCredentialsNonExpired());
                
                // Test password encoding directly
                boolean passwordMatches = passwordEncoder.matches("admin123", user.getPassword());
                response.put("directPasswordMatch", passwordMatches);
                
                response.put("rawPassword", "admin123");
                response.put("encodedPassword", user.getPassword().substring(0, 20) + "...");
            } else {
                response.put("userFound", false);
            }
            
            response.put("status", "SUCCESS");
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("error", e.getMessage());
            response.put("stackTrace", e.getStackTrace()[0].toString());
        }
        return ResponseEntity.ok(response);
    }

    // PROPER FIX: Recreate users exactly like DataSeeder
    @GetMapping("/debug/recreate-users")
    public ResponseEntity<Map<String, Object>> recreateUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Delete existing users first
            userRepository.deleteAll();
            
            // Create admin user exactly like DataSeeder
            com.erp.course.backend.entity.User admin = new com.erp.course.backend.entity.User();
            admin.setUsername("admin");
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setEmail("admin@university.edu");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(com.erp.course.backend.entity.Role.ADMIN);
            userRepository.save(admin);
            
            // Create instructor user exactly like DataSeeder
            com.erp.course.backend.entity.User instructor = new com.erp.course.backend.entity.User();
            instructor.setUsername("instructor");
            instructor.setFirstName("John");
            instructor.setLastName("Smith");
            instructor.setEmail("instructor@university.edu");
            instructor.setPassword(passwordEncoder.encode("instructor123"));
            instructor.setRole(com.erp.course.backend.entity.Role.INSTRUCTOR);
            userRepository.save(instructor);
            
            // Create student user exactly like DataSeeder
            com.erp.course.backend.entity.User student = new com.erp.course.backend.entity.User();
            student.setUsername("student");
            student.setFirstName("Jane");
            student.setLastName("Doe");
            student.setEmail("student@university.edu");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setRole(com.erp.course.backend.entity.Role.STUDENT);
            userRepository.save(student);
            
            response.put("usersRecreated", 3);
            response.put("totalUsers", userRepository.count());
            response.put("status", "SUCCESS");
            response.put("message", "Users recreated exactly like DataSeeder");
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
} 