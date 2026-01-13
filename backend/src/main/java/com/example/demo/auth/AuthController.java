package com.example.demo.auth;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.dto.AuthResponse;
import com.example.demo.auth.dto.ForgotPasswordRequest;
import com.example.demo.auth.dto.ForgotPasswordResponse;
import com.example.demo.auth.dto.LoginRequest;
import com.example.demo.auth.dto.RegisterRequest;
import com.example.demo.auth.dto.ResetPasswordRequest;
import com.example.demo.auth.dto.UserDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
		return authService.register(request);
	}

	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request);
	}

	@PostMapping("/forgot-password")
	public ForgotPasswordResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
		return authService.forgotPassword(request.identifier());
	}

	@PostMapping("/reset-password")
	public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		authService.resetPassword(request);
	}

	@GetMapping("/me")
	public UserDto me(Authentication authentication) {
		return authService.me((String) authentication.getPrincipal());
	}
}
