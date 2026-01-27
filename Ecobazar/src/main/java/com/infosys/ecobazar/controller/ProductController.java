package com.infosys.ecobazar.controller;

import com.infosys.ecobazar.entity.Product;
import com.infosys.ecobazar.entity.User;
import com.infosys.ecobazar.repository.UserRepository;
import com.infosys.ecobazar.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    // 1. PUBLIC: Get Only APPROVED Products (For Shop)
    @GetMapping("/all")
    public List<Product> getAllShopProducts() {
        return productService.getAllApprovedProducts();
    }

    // 1.5 Seller: Get ALL my products (Approved or Pending)
    // (Ideally, we would filter by Seller ID, but for now getting all is fine for the dashboard list)
    @GetMapping("/seller-inventory")
    public List<Product> getSellerInventory() {
        return productService.getAllProducts();
    }

    // 2. ADMIN: Get Pending Products
    @GetMapping("/pending")
    public List<Product> getPendingProducts() {
        return productService.getPendingProducts();
    }

    // 3. ADMIN: Approve Product
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveProduct(@PathVariable Long id) {
        // Check Admin Role
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOpt = userRepository.findByEmail(auth.getName());
        if (userOpt.isEmpty() || !userOpt.get().getRole().toString().equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admins only.");
        }

        productService.approveProduct(id);
        return ResponseEntity.ok("Product Approved! 🟢");
    }

    // 4. Add Product (Defaults to Pending)
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOpt = userRepository.findByEmail(auth.getName());
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");

        User seller = userOpt.get();
        product.setSellerId(seller.getId());

        // Calculate Grade
        if (product.getCarbonFootprint() != null) {
            double co2 = product.getCarbonFootprint();
            if (co2 < 2.0) product.setEcoRating("A");
            else if (co2 < 10.0) product.setEcoRating("B");
            else product.setEcoRating("C");
        } else {
            product.setEcoRating("?");
        }

        Product saved = productService.addProduct(product);
        return ResponseEntity.ok(saved);
    }

    // 5. Get Single
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // 6. Update
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product newDetails) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOpt = userRepository.findByEmail(auth.getName());
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Product> existingOpt = productService.getProductById(id);
        if (existingOpt.isEmpty()) return ResponseEntity.notFound().build();

        // Security Check
        User currentUser = userOpt.get();
        Product p = existingOpt.get();
        boolean isOwner = p.getSellerId() != null && p.getSellerId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole().toString().equalsIgnoreCase("ADMIN");

        if (!isOwner && !isAdmin) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        Product updated = productService.updateProduct(id, newDetails);

        // Re-calc grade
        if (updated.getCarbonFootprint() != null) {
            double co2 = updated.getCarbonFootprint();
            if (co2 < 2.0) updated.setEcoRating("A");
            else if (co2 < 10.0) updated.setEcoRating("B");
            else updated.setEcoRating("C");
        }
        productService.saveProduct(updated);
        return ResponseEntity.ok(updated);
    }

    // 7. Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOpt = userRepository.findByEmail(auth.getName());
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Product> productOpt = productService.getProductById(id);
        if (productOpt.isEmpty()) return ResponseEntity.notFound().build();

        User currentUser = userOpt.get();
        Product p = productOpt.get();
        boolean isOwner = p.getSellerId() != null && p.getSellerId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole().toString().equalsIgnoreCase("ADMIN");

        if (isOwner || isAdmin) {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Deleted");
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}