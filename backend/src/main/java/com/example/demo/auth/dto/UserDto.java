package com.example.demo.auth.dto;

public record UserDto(
		Long id,
		String firstName,
		String lastName,
		String email,
		String username,
		String phoneNumber) {
}
