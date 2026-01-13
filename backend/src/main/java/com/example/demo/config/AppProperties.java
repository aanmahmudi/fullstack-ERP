package com.example.demo.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(AuthProperties auth, CorsProperties cors) {

	public record AuthProperties(
			String jwtSecret,
			long jwtTtlMinutes,
			long resetTokenTtlMinutes,
			boolean exposeResetToken) {
	}

	public record CorsProperties(List<String> allowedOrigins) {
	}
}
