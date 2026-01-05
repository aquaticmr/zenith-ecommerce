package com.example.ecommerce.demo.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 1000)
    private String description;
    private String category; // "MEN", "WOMEN", "ACCESSORIES"
    private Double price;
    private String imageUrl; // This will store the Cloudinary URL
    private Integer stock;
}