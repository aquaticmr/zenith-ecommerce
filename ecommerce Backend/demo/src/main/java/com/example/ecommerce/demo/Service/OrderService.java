package com.example.ecommerce.demo.Service;



import com.example.ecommerce.demo.entity.*;
import com.example.ecommerce.demo.respository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private JavaMailSender mailSender;

    @Transactional
    public Order placeOrder(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("CONFIRMED");

        double total = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Product out of stock: " + product.getName());
            }

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItems.add(orderItem);

            total += product.getPrice() * cartItem.getQuantity();
        }

        order.setTotalAmount(total);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteByUser(user);

        // --- UPDATED FOR ZENITH BRANDING ---
        String subject = "ZENITH - Order Confirmed #" + savedOrder.getId();
        String body = "Hi " + user.getName() + ",\n\n" +
                "Thank you for your purchase from the ZENITH Collective. " +
                "Your order of $" + String.format("%.2f", savedOrder.getTotalAmount()) + " has been received.\n\n" +
                "Order ID: " + savedOrder.getId() + "\n" +
                "Status: " + savedOrder.getStatus() + "\n\n" +
                "We are currently preparing your high-fidelity selection for shipment.";

        sendEmail(user.getEmail(), subject, body);

        return savedOrder;
    }

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            // Sets the "Display Name" in some email clients
            message.setFrom("ZENITH <your-email@gmail.com>");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("ZENITH Email Service Error: " + e.getMessage());
        }
    }
}