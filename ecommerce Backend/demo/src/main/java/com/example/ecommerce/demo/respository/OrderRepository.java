package com.example.ecommerce.demo.respository;



import com.example.ecommerce.demo.entity.Order;
import com.example.ecommerce.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Get all orders placed by a specific user
    List<Order> findByUser(User user);

    // Find an order by the Razorpay ID (useful for payment verification)

}