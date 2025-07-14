package com.erp.course.backend.controller;

import com.erp.course.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private UserRepository userRepository;

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
} 