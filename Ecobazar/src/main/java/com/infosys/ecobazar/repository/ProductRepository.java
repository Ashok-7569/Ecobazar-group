package com.infosys.ecobazar.repository;

import com.infosys.ecobazar.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // For the Shop: Show only Approved items
    List<Product> findByIsApprovedTrue();

    // For the Admin: Show only Pending items
    List<Product> findByIsApprovedFalse();
}