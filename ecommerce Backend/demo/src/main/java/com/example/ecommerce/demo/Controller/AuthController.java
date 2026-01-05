package com.example.ecommerce.demo.Controller;



import com.example.ecommerce.demo.Service.OrderService;
import com.example.ecommerce.demo.dto.LoginRequest;
import com.example.ecommerce.demo.dto.RegisterRequest;
import com.example.ecommerce.demo.entity.Role;
import com.example.ecommerce.demo.entity.User;
import com.example.ecommerce.demo.respository.UserRepository;
import com.example.ecommerce.demo.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private OrderService orderService;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword())); // Encode password
        user.setProvider("LOCAL");

        // CRITICAL FIX: Set the role here!
        user.setRole(Role.USER);

        userRepository.save(user);

        // Optional: Send Welcome Email
        try {
            orderService.sendEmail(user.getEmail(), "Welcome to ZENITH", "Hi " + user.getName() + "!");
        } catch (Exception e) {
            System.out.println("Email failed but user created.");
        }

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );

            User user = userRepository.findByEmail(req.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // SAFETY CHECK: If role is null, fix it on the fly
            if (user.getRole() == null) {
                user.setRole(Role.USER);
                userRepository.save(user);
            }

            String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

            return ResponseEntity.ok(Map.of("token", token));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid Email or Password");
        } catch (Exception e) {
            e.printStackTrace(); // This will show the real error in IntelliJ console
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}
