package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.ChatbotService;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    // Simple endpoint to check if the controller is accessible
    @GetMapping("/hello")
    public Map<String, Object> hello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Chatbot API is working!");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    // Test the cybersecurity response with a predefined question
    @GetMapping("/test")
    public Map<String, String> testQuery() {
        try {
            String response = chatbotService.processCybersecurityQuery("What is a firewall?");
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("response", response);
            return responseMap;
        } catch (Exception e) {
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("response", "Error: " + e.getMessage());
            return responseMap;
        }
    }
    
    // Main endpoint to process user queries
    @PostMapping("/query")
    public Map<String, String> processChatQuery(@RequestBody Map<String, String> request) {
        try {
            String query = request.get("query");
            
            if (query == null || query.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("response", "Please provide a valid question.");
                return errorResponse;
            }
            
            System.out.println("Received query: " + query);
            
            String response = chatbotService.processCybersecurityQuery(query);
            
            if (response == null || response.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("response", "I couldn't generate a response. Please try again later.");
                return errorResponse;
            }
            
            System.out.println("Sending response: " + response.substring(0, Math.min(100, response.length())) + "...");
            
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("response", response);
            return responseMap;
        } catch (Exception e) {
            System.out.println("Controller error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("response", "An unexpected error occurred. Please try again later.");
            return errorResponse;
        }
    }
} 