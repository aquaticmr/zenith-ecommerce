package com.example.ecommerce.demo.Controller;



import com.example.ecommerce.demo.entity.CartItem;
import com.example.ecommerce.demo.entity.User;
import com.example.ecommerce.demo.respository.UserRepository;
import com.example.ecommerce.demo.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/cart")
public class CartController {

    @Autowired private CartService cartService;
    @Autowired private UserRepository userRepository;

    @PostMapping("/add")
    public CartItem addToCart(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername()).get();
        return cartService.addToCart(productId, quantity, user);
    }

    @GetMapping
    public List<CartItem> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).get();
        return cartService.getCartForUser(user);
    }
}
