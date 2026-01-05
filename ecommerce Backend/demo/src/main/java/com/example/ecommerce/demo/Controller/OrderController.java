package com.example.ecommerce.demo.Controller;



import com.example.ecommerce.demo.entity.Order;
import com.example.ecommerce.demo.entity.User;
import com.example.ecommerce.demo.respository.OrderRepository;
import com.example.ecommerce.demo.respository.UserRepository;
import com.example.ecommerce.demo.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/orders")
public class OrderController {

    @Autowired private OrderService orderService;
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@AuthenticationPrincipal UserDetails userDetails) {
        // 1. Get current logged in user
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Call your service logic
        Order order = orderService.placeOrder(user);

        return ResponseEntity.ok(order);
    }

    @GetMapping("/my-orders") // Added a specific sub-path
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        List<Order> orders = orderRepository.findByUser(userOpt.get());
        return ResponseEntity.ok(orders); // This returns [ {...}, {...} ]
    }

}
