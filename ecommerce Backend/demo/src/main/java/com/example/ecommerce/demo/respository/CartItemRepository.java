package com.example.ecommerce.demo.respository;



import com.example.ecommerce.demo.entity.CartItem;
import com.example.ecommerce.demo.entity.Product;
import com.example.ecommerce.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Get all items in a specific user's cart
    List<CartItem> findByUser(User user);

    // Check if a specific product is already in a user's cart
    Optional<CartItem> findByUserAndProduct(User user, Product product);

    // Clear the cart after an order is successfully placed
    void deleteByUser(User user);
}
