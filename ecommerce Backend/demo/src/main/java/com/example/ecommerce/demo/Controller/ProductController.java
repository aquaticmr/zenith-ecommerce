package com.example.ecommerce.demo.Controller;


import com.example.ecommerce.demo.entity.Product;
import com.example.ecommerce.demo.Service.ImageService;
import com.example.ecommerce.demo.Service.ProductService;
import com.example.ecommerce.demo.respository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired private ProductService productService;
    @Autowired private ImageService imageService;

    // FIX: Added @GetMapping and @RequestParam to actually receive the data from the URL
    @GetMapping
    public Page<Product> getProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        // We delegate the logic to the Service to keep the controller clean
        return productService.getProducts(name, category, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/admin/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public Product addProduct(
            @RequestPart("product") String productJson,
            @RequestPart("image") MultipartFile file) throws Exception {

        Product product = new ObjectMapper().readValue(productJson, Product.class);
        String imageUrl = imageService.uploadImage(file);
        product.setImageUrl(imageUrl);

        return productService.saveProduct(product);
    }
}