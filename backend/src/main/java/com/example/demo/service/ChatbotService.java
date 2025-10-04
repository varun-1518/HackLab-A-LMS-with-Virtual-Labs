package com.example.demo.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChatbotService {

    @Value("${gemini.api.key}")
    private String apiKey;
    
    @Value("${gemini.api.model}")
    private String apiModel;
    
    @Value("${gemini.api.version}")
    private String apiVersion;
    
    @Value("${gemini.api.base-url}")
    private String apiBaseUrl;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();
    
    // Fallback responses when API is not available
    private final String[] fallbackResponses = {
        "As a cybersecurity expert, I recommend using strong, unique passwords for all your accounts and enabling two-factor authentication whenever possible.",
        "To protect your personal data online, always verify the security of websites (look for HTTPS), use updated antivirus software, and be cautious about sharing sensitive information.",
        "A common security vulnerability is SQL injection, which occurs when attackers insert malicious SQL code into database queries. Always validate and sanitize user inputs to prevent this.",
        "Phishing attacks often appear as legitimate emails asking for sensitive information. Always verify the sender's email address and never click suspicious links.",
        "To secure your home network, change default router passwords, enable WPA3 encryption if available, and regularly update your router's firmware.",
        "Ransomware attacks encrypt your files and demand payment for decryption. The best protection is maintaining regular backups and being cautious about opening attachments.",
        "Zero-day vulnerabilities are security flaws unknown to the software vendor. Keep all software updated and use security solutions that detect suspicious behavior.",
        "For secure web browsing, consider using a VPN to encrypt your connection, especially on public Wi-Fi networks."
    };
    
    /**
     * Process a cybersecurity query using the Gemini API
     * 
     * @param query The user's cybersecurity question
     * @return The response from Gemini
     */
    public String processCybersecurityQuery(String query) {
        try {
            System.out.println("Processing cybersecurity query: " + query);
            
            // Try to use the Gemini API first
            try {
                String response = callGeminiApi(query);
                if (response != null && !response.isEmpty()) {
                    return response;
                }
            } catch (Exception e) {
                System.out.println("Gemini API error: " + e.getMessage());
                // Fall through to use fallback responses
            }
            
            // If API call fails, use fallback responses
            return getFallbackResponse(query);
            
        } catch (Exception e) {
            System.out.println("Exception in chatbot service: " + e.getMessage());
            e.printStackTrace();
            return "I encountered an error, but I can still help with cybersecurity questions. Please try a different question.";
        }
    }
    
    /**
     * Call the Gemini API with the user's query
     */
    private String callGeminiApi(String query) throws IOException, InterruptedException {
        // Build the API URL using configuration properties
        String apiUrl = String.format("%s/%s/models/%s:generateContent?key=%s", 
                apiBaseUrl, apiVersion, apiModel, apiKey);
        
        System.out.println("Using API URL: " + apiUrl.substring(0, apiUrl.indexOf("?key=")) + "?key=REDACTED");
        
        // Create the request payload for Gemini 2.0 Flash
        // Note: The model doesn't support the "system" role, so we need to include instructions in the user prompt
        Map<String, Object> requestMap = new HashMap<>();
        
        // Create a single content object with the user query and instructions
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> textPart = new HashMap<>();
        
        // Combine instructions and query
        String promptWithInstructions = 
            "You are a cybersecurity assistant that specializes in helping users with security questions. " +
            "Provide accurate, concise information about cybersecurity topics only. " +
            "If asked about topics unrelated to cybersecurity, politely redirect to security topics.\n\n" +
            "User query: " + query;
        
        textPart.put("text", promptWithInstructions);
        content.put("parts", List.of(textPart));
        
        // Add content to the request
        requestMap.put("contents", List.of(content));
        
        // Set generation parameters optimized for Gemini 2.0 Flash
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.2);
        generationConfig.put("maxOutputTokens", 800);
        generationConfig.put("topP", 0.95);
        generationConfig.put("topK", 40);
        requestMap.put("generationConfig", generationConfig);
        
        // Convert to JSON
        String requestBody = objectMapper.writeValueAsString(requestMap);
        
        System.out.println("Request body: " + requestBody);
        
        // Create and send the HTTP request
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(apiUrl))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();
        
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        System.out.println("Response status: " + response.statusCode());
        
        // Handle the response
        if (response.statusCode() == 200) {
            try {
                Map<String, Object> responseMap = objectMapper.readValue(response.body(), Map.class);
                System.out.println("Response keys: " + responseMap.keySet());
                
                // Extract the text from the standard Gemini API response format
                if (responseMap.containsKey("candidates")) {
                    List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map<String, Object> candidate = candidates.get(0);
                        Map<String, Object> candidateContent = (Map<String, Object>) candidate.get("content");
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) candidateContent.get("parts");
                        Map<String, Object> firstPart = parts.get(0);
                        String text = (String) firstPart.get("text");
                        
                        System.out.println("Successfully extracted response text");
                        return text;
                    }
                }
                
                System.out.println("Couldn't extract text from response: " + response.body());
                return null; // Will trigger fallback response
            } catch (Exception e) {
                System.out.println("Error parsing response: " + e.getMessage());
                System.out.println("Raw response: " + response.body());
                e.printStackTrace();
                return null; // Will trigger fallback response
            }
        } else {
            System.out.println("Error response (" + response.statusCode() + "): " + response.body());
            return null; // Will trigger fallback response
        }
    }
    
    /**
     * Get a fallback response based on the query
     */
    private String getFallbackResponse(String query) {
        // Very simple query matching logic for fallback responses
        query = query.toLowerCase();
        
        if (query.contains("password") || query.contains("secure password")) {
            return fallbackResponses[0];
        } else if (query.contains("protect") || query.contains("personal data") || query.contains("privacy")) {
            return fallbackResponses[1];
        } else if (query.contains("sql") || query.contains("injection") || query.contains("vulnerability")) {
            return fallbackResponses[2];
        } else if (query.contains("phishing") || query.contains("email") || query.contains("scam")) {
            return fallbackResponses[3];
        } else if (query.contains("wifi") || query.contains("router") || query.contains("network")) {
            return fallbackResponses[4];
        } else if (query.contains("ransomware") || query.contains("malware") || query.contains("virus")) {
            return fallbackResponses[5];
        } else if (query.contains("zero") || query.contains("day") || query.contains("vulnerability")) {
            return fallbackResponses[6];
        } else {
            return fallbackResponses[7];
        }
    }
} 