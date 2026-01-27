package com.infosys.ecobazar.service;

import com.infosys.ecobazar.entity.Product;
import com.infosys.ecobazar.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // 1. For Shop (Only Approved)
    public List<Product> getAllApprovedProducts() {
        return productRepository.findByIsApprovedTrue();
    }

    // 2. For Admin (Only Pending)
    public List<Product> getPendingProducts() {
        return productRepository.findByIsApprovedFalse();
    }

    // 3. For Seller Dashboard (Show Everything)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(Product product) {
        // Force new items to be hidden by default
        product.setIsApproved(false);
        return productRepository.save(product);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, Product newDetails) {
        return productRepository.findById(id).map(existing -> {
            if(newDetails.getName() != null) existing.setName(newDetails.getName());
            if(newDetails.getPrice() != null) existing.setPrice(newDetails.getPrice());
            if(newDetails.getDescription() != null) existing.setDescription(newDetails.getDescription());
            if(newDetails.getImageUrl() != null) existing.setImageUrl(newDetails.getImageUrl());
            if(newDetails.getCarbonFootprint() != null) existing.setCarbonFootprint(newDetails.getCarbonFootprint());

            // Note: Editing a product does NOT auto-approve it. It stays as it was.
            return productRepository.save(existing);
        }).orElse(null);
    }

    // --- NEW: APPROVE METHOD ---
    public Product approveProduct(Long id) {
        return productRepository.findById(id).map(product -> {
            product.setIsApproved(true);
            return productRepository.save(product);
        }).orElse(null);
    }
}