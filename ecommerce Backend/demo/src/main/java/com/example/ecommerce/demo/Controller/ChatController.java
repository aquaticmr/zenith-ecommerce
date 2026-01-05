package com.example.ecommerce.demo.Controller;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class ChatController {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=";

    @PostMapping("/chat")
    public Map<String, Object> getAiResponse(@RequestBody Map<String, String> request) {
        String userPrompt = request.get("prompt");

        // Prepare the request for Gemini
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", "You are Aurkira AI, a luxury fashion assistant. Be helpful, concise, and professional. " + userPrompt)
                        ))
                )
        );

        try {
            Map<String, Object> response = restTemplate.postForObject(GEMINI_URL + apiKey, body, Map.class);
            // Extract the text from Gemini's complex response structure
            List candidates = (List) response.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);

            return Map.of("reply", firstPart.get("text"));
        } catch (Exception e) {
            return Map.of("reply", "I'm having trouble connecting to my neural network. Please try again.");
        }
    }
}
