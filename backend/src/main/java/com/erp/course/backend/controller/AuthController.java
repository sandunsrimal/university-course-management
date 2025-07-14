package com.erp.course.backend.controller;

import com.erp.course.backend.dto.JwtResponse;
import com.erp.course.backend.dto.LoginRequest;
import com.erp.course.backend.dto.MessageResponse;
import com.erp.course.backend.entity.User;
import com.erp.course.backend.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("🔍 Login attempt: " + loginRequest.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            
            System.out.println("✅ Authentication successful");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            User user = (User) authentication.getPrincipal();
            
            return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getUsername(), 
                    user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole()));
        } catch (Exception e) {
            System.out.println("❌ Authentication failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid username or password"));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        return ResponseEntity.ok(new MessageResponse("You've been signed out successfully!"));
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not authenticated"));
        }
        
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(new JwtResponse(null, user.getId(), user.getUsername(), 
                user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole()));
    }
} 