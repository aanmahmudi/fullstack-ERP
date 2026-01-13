package com.example.demo.auth;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.config.AppProperties;
import com.example.demo.user.UserAccount;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final AppProperties.AuthProperties authProperties;

	public JwtService(AppProperties appProperties) {
		this.authProperties = appProperties.auth();
	}

	public String createToken(UserAccount user) {
		Instant now = Instant.now();
		Instant exp = now.plusSeconds(authProperties.jwtTtlMinutes() * 60);

		return Jwts.builder()
				.subject(String.valueOf(user.getId()))
				.issuedAt(Date.from(now))
				.expiration(Date.from(exp))
				.claims(Map.of(
						"username", user.getUsername(),
						"email", user.getEmail()))
				.signWith(Keys.hmacShaKeyFor(authProperties.jwtSecret().getBytes(StandardCharsets.UTF_8)))
				.compact();
	}

	public Claims parseClaims(String token) {
		return Jwts.parser()
				.verifyWith(Keys.hmacShaKeyFor(authProperties.jwtSecret().getBytes(StandardCharsets.UTF_8)))
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}
