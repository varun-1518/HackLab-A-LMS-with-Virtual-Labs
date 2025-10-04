package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "LMS Backend is running!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
} 