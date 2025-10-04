package com.example.demo.controller;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api-test")
public class ApiTestController {

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

    @GetMapping("/key-info")
    public ResponseEntity<Map<String, Object>> getApiKeyInfo() {
        Map<String, Object> response = new HashMap<>();
        
        // Basic API key validation
        boolean keyValid = (apiKey != null && !apiKey.isEmpty());
        boolean formatValid = (keyValid && apiKey.startsWith("AIza"));
        boolean lengthValid = (keyValid && apiKey.length() >= 30);
        
        response.put("keyPresent", keyValid);
        response.put("keyFormatValid", formatValid);
        response.put("keyLengthValid", lengthValid);
        response.put("configuredModel", apiModel);
        response.put("configuredVersion", apiVersion);
        
        if (keyValid) {
            response.put("keyStart", apiKey.substring(0, 5));
            response.put("keyEnd", apiKey.substring(apiKey.length() - 3));
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/gemini-test")
    public ResponseEntity<Map<String, Object>> testGeminiApi() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Build the API URL from configuration
            String apiUrl = String.format("%s/%s/models/%s:generateContent?key=%s", 
                    apiBaseUrl, apiVersion, apiModel, apiKey);
            
            response.put("apiEndpoint", apiUrl.substring(0, apiUrl.indexOf("?key=")) + "?key=REDACTED");
            
            // Create a minimal request payload
            Map<String, Object> requestMap = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            
            part.put("text", "Say hello world");
            content.put("parts", List.of(part));
            requestMap.put("contents", List.of(content));
            
            String requestBody = objectMapper.writeValueAsString(requestMap);
            response.put("requestBody", requestBody);
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
            
            HttpResponse<String> apiResponse = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            response.put("statusCode", apiResponse.statusCode());
            response.put("successful", apiResponse.statusCode() == 200);
            
            // Include response information
            if (apiResponse.statusCode() == 200) {
                Map<String, Object> parsedResponse = objectMapper.readValue(apiResponse.body(), Map.class);
                response.put("responseKeys", parsedResponse.keySet());
                response.put("status", "success");
                
                // Try to extract the text from the response
                try {
                    List<Map<String, Object>> candidates = (List<Map<String, Object>>) parsedResponse.get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map<String, Object> candidate = candidates.get(0);
                        Map<String, Object> candidateContent = (Map<String, Object>) candidate.get("content");
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) candidateContent.get("parts");
                        Map<String, Object> firstPart = parts.get(0);
                        String text = (String) firstPart.get("text");
                        response.put("sampleResponse", text.substring(0, Math.min(100, text.length())) + "...");
                    }
                } catch (Exception e) {
                    response.put("extractionError", e.getMessage());
                }
            } else {
                response.put("errorBody", apiResponse.body());
                response.put("status", "error");
            }
            
        } catch (IOException | InterruptedException e) {
            response.put("status", "error");
            response.put("exception", e.getClass().getName());
            response.put("message", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
} 