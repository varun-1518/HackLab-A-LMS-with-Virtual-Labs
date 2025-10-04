package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ApiKeyChecker implements CommandLineRunner {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n==== Checking Gemini API Key ====");
        
        if (apiKey == null || apiKey.isEmpty()) {
            System.out.println("ERROR: No Gemini API key found in application.properties!");
            System.out.println("Please add gemini.api.key=YOUR_KEY_HERE to application.properties");
            return;
        }
        
        // Check if the API key looks like a valid Google API key
        if (!apiKey.startsWith("AIza")) {
            System.out.println("WARNING: Your API key doesn't start with 'AIza', which is typical for Google API keys");
            System.out.println("Current key format: " + apiKey.substring(0, Math.min(5, apiKey.length())) + "...");
        } else {
            System.out.println("API key format appears valid (starts with AIza)");
        }
        
        if (apiKey.length() < 30) {
            System.out.println("WARNING: Your API key seems too short. Google API keys are typically longer");
            System.out.println("Current key length: " + apiKey.length() + " characters");
        } else {
            System.out.println("API key length appears valid (" + apiKey.length() + " characters)");
        }
        
        System.out.println("API Key: " + apiKey.substring(0, 5) + "..." + 
                          apiKey.substring(apiKey.length() - 3));
        System.out.println("==== API Key Check Complete ====\n");
    }
} 