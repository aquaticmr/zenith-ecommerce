package com.example.ecommerce.demo.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "users") @Data
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true) private String email;
    private String password;
    private String name;
    private String provider; // LOCAL, GOOGLE, GITHUB
    @Enumerated(EnumType.STRING) private Role role;

    public void setRole(com.example.ecommerce.demo.entity.Role role) {
    }

    public enum Role { USER, ADMIN }
}