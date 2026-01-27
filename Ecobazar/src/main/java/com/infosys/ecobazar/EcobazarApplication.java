package com.infosys.ecobazar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// This "exclude" part is what turns off the 401 lock!
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class EcobazarApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcobazarApplication.class, args);
	}

}