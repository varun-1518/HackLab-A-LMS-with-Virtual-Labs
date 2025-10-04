package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/test")
    public String simpleTest() {
        return "Test controller is working!";
    }
    
    @GetMapping("/api/test")
    public String apiTest() {
        return "API test endpoint is working!";
    }
} 