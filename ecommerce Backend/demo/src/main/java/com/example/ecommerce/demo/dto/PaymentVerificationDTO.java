package com.example.ecommerce.demo.dto;



import lombok.Data;

@Data
public class PaymentVerificationDTO {
    private String razorpay_order_id;
    private String razorpay_payment_id;
    private String razorpay_signature;
}
