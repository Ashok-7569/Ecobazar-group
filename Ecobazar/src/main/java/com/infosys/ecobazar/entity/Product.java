package com.infosys.ecobazar.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double price;

    private String category;

    private String imageUrl;

    // --- MILESTONE 2 FIELDS ---
    private Double carbonFootprint;
    private Boolean ecoCertified;
    private String ecoRating;

    // --- MILESTONE 2.5: SECURITY ---
    private Long sellerId;

    // --- MILESTONE 2.9: ADMIN APPROVAL (New) ---
    @Column(name = "is_approved")
    private Boolean isApproved = false; // Default: Hidden (Pending)
    // -------------------------------------------

    // --- CONSTRUCTORS ---
    public Product() {}

    public Product(String name, String description, Double price, String category, String imageUrl, Long sellerId) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.sellerId = sellerId;
        this.isApproved = false; // Explicitly set to false for new items
    }

    // --- GETTERS AND SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Double getCarbonFootprint() { return carbonFootprint; }
    public void setCarbonFootprint(Double carbonFootprint) { this.carbonFootprint = carbonFootprint; }

    public Boolean getEcoCertified() { return ecoCertified; }
    public void setEcoCertified(Boolean ecoCertified) { this.ecoCertified = ecoCertified; }

    public String getEcoRating() { return ecoRating; }
    public void setEcoRating(String ecoRating) { this.ecoRating = ecoRating; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    // --- NEW Getters/Setters for Approval ---
    public Boolean getIsApproved() { return isApproved; }
    public void setIsApproved(Boolean isApproved) { this.isApproved = isApproved; }
}