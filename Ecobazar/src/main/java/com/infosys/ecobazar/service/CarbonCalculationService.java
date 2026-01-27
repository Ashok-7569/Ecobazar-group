package com.infosys.ecobazar.service;

import org.springframework.stereotype.Service;

@Service
public class CarbonCalculationService {

    // Logic to calculate Eco-Rating based on CO2 emissions (kg per unit)
    public String calculateEcoRating(Double co2PerKg) {
        if (co2PerKg == null) return "Unknown";

        if (co2PerKg <= 2.0) {
            return "A"; // Excellent
        } else if (co2PerKg <= 5.0) {
            return "B"; // Good
        } else if (co2PerKg <= 10.0) {
            return "C"; // Average
        } else {
            return "D"; // High Impact
        }
    }
}