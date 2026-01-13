package com.example.demo.user;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

	@Query("""
			select t
			from PasswordResetToken t
			join fetch t.user u
			where t.tokenHash = :tokenHash
			  and t.usedAt is null
			  and t.expiresAt > :now
			""")
	Optional<PasswordResetToken> findValidToken(@Param("tokenHash") String tokenHash, @Param("now") Instant now);
}
