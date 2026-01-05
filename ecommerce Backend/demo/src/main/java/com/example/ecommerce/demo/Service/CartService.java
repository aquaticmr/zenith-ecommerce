package com.example.ecommerce.demo.Service;

import com.example.ecommerce.demo.entity.CartItem;
import com.example.ecommerce.demo.entity.Product;
import com.example.ecommerce.demo.entity.User;
import com.example.ecommerce.demo.respository.CartItemRepository;
import com.example.ecommerce.demo.respository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private ProductRepository productRepository;

    public CartItem addToCart(Long productId, Integer quantity, User user) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing = cartItemRepository.findByUserAndProduct(user, product);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            return cartItemRepository.save(newItem);
        }
    }

    public List<CartItem> getCartForUser(User user) {
        return cartItemRepository.findByUser(user);
    }
}
