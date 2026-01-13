package com.example.demo.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.auth.dto.AuthResponse;
import com.example.demo.auth.dto.ForgotPasswordResponse;
import com.example.demo.auth.dto.LoginRequest;
import com.example.demo.auth.dto.RegisterRequest;
import com.example.demo.auth.dto.ResetPasswordRequest;
import com.example.demo.auth.dto.UserDto;
import com.example.demo.config.AppProperties;
import com.example.demo.user.PasswordResetToken;
import com.example.demo.user.PasswordResetTokenRepository;
import com.example.demo.user.UserAccount;
import com.example.demo.user.UserAccountRepository;

@Service
public class AuthService {

	private final UserAccountRepository userAccountRepository;
	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AppProperties.AuthProperties authProperties;
	private final SecureRandom secureRandom = new SecureRandom();

	public AuthService(
			UserAccountRepository userAccountRepository,
			PasswordResetTokenRepository passwordResetTokenRepository,
			PasswordEncoder passwordEncoder,
			JwtService jwtService,
			AppProperties appProperties) {
		this.userAccountRepository = userAccountRepository;
		this.passwordResetTokenRepository = passwordResetTokenRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.authProperties = appProperties.auth();
	}

	@Transactional
	public AuthResponse register(RegisterRequest request) {
		String email = request.email().trim();
		String username = request.username().trim();

		if (userAccountRepository.findByEmailIgnoreCase(email).isPresent()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email sudah terdaftar");
		}
		if (userAccountRepository.findByUsernameIgnoreCase(username).isPresent()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Username sudah terdaftar");
		}

		UserAccount user = new UserAccount();
		user.setFirstName(request.firstName().trim());
		user.setLastName(request.lastName().trim());
		user.setEmail(email);
		user.setUsername(username);
		user.setPhoneNumber(request.phoneNumber().trim());
		user.setPasswordHash(passwordEncoder.encode(request.password()));

		UserAccount saved = userAccountRepository.save(user);
		String token = jwtService.createToken(saved);
		return new AuthResponse(token, toDto(saved));
	}

	@Transactional(readOnly = true)
	public AuthResponse login(LoginRequest request) {
		UserAccount user = userAccountRepository.findByUsernameOrEmailIgnoreCase(request.identifier().trim())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login gagal"));

		if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login gagal");
		}

		String token = jwtService.createToken(user);
		return new AuthResponse(token, toDto(user));
	}

	@Transactional
	public ForgotPasswordResponse forgotPassword(String identifier) {
		UserAccount user = userAccountRepository.findByUsernameOrEmailIgnoreCase(identifier.trim()).orElse(null);
		if (user == null) {
			return new ForgotPasswordResponse("Jika akun ditemukan, link reset akan diproses", null);
		}

		String rawToken = generateRawToken();
		String tokenHash = sha256Hex(rawToken);

		PasswordResetToken token = new PasswordResetToken();
		token.setUser(user);
		token.setTokenHash(tokenHash);
		token.setExpiresAt(Instant.now().plusSeconds(authProperties.resetTokenTtlMinutes() * 60));
		passwordResetTokenRepository.save(token);

		String exposedToken = authProperties.exposeResetToken() ? rawToken : null;
		return new ForgotPasswordResponse("Jika akun ditemukan, link reset akan diproses", exposedToken);
	}

	@Transactional
	public void resetPassword(ResetPasswordRequest request) {
		String tokenHash = sha256Hex(request.token().trim());
		PasswordResetToken token = passwordResetTokenRepository.findValidToken(tokenHash, Instant.now())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token reset tidak valid"));

		UserAccount user = token.getUser();
		user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
		token.setUsedAt(Instant.now());

		userAccountRepository.save(user);
		passwordResetTokenRepository.save(token);
	}

	@Transactional(readOnly = true)
	public UserDto me(String userId) {
		long id;
		try {
			id = Long.parseLong(userId);
		} catch (NumberFormatException ex) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
		}
		UserAccount user = userAccountRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
		return toDto(user);
	}

	private UserDto toDto(UserAccount user) {
		return new UserDto(
				user.getId(),
				user.getFirstName(),
				user.getLastName(),
				user.getEmail(),
				user.getUsername(),
				user.getPhoneNumber());
	}

	private String generateRawToken() {
		byte[] bytes = new byte[32];
		secureRandom.nextBytes(bytes);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
	}

	private static String sha256Hex(String value) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
			StringBuilder sb = new StringBuilder(hash.length * 2);
			for (byte b : hash) {
				sb.append(String.format("%02x", b));
			}
			return sb.toString();
		} catch (Exception ex) {
			throw new IllegalStateException(ex);
		}
	}
}
