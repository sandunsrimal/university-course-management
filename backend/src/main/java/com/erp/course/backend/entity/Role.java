package com.erp.course.backend.entity;

public enum Role {
    ADMIN("Admin"),
    INSTRUCTOR("Instructor"),
    STUDENT("Student");
    
    private final String displayName;
    
    Role(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
} 