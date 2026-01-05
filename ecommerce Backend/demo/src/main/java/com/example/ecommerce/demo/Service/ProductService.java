package com.example.ecommerce.demo.Service;

import com.example.ecommerce.demo.entity.Product;
import com.example.ecommerce.demo.respository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired private ProductRepository productRepository;

    public Page<Product> getProducts(String name, String category, Pageable pageable) {
        // 1. If category is provided (and not "all"), filter the database
        if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("all")) {
            return productRepository.findByCategoryIgnoreCase(category, pageable);
        }

        // 2. If name is provided (search), filter by name
        if (name != null && !name.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(name, pageable);
        }

        // 3. Otherwise, return everything (New Arrivals / Trending)
        return productRepository.findAll(pageable);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}