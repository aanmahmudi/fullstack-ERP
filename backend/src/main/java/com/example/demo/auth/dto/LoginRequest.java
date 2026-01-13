package com.example.demo.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
		@NotBlank String identifier,
		@NotBlank @Size(min = 8, max = 72) String password) {
}
