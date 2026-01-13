package com.example.demo.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

	@Query("select u from UserAccount u where lower(u.email) = lower(:email)")
	Optional<UserAccount> findByEmailIgnoreCase(@Param("email") String email);

	@Query("select u from UserAccount u where lower(u.username) = lower(:username)")
	Optional<UserAccount> findByUsernameIgnoreCase(@Param("username") String username);

	@Query("""
			select u
			from UserAccount u
			where lower(u.username) = lower(:identifier)
			   or lower(u.email) = lower(:identifier)
			""")
	Optional<UserAccount> findByUsernameOrEmailIgnoreCase(@Param("identifier") String identifier);
}
