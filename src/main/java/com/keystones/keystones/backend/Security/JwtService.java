package com.keystones.keystones.backend.Security;

import java.nio.charset.StandardCharsets;
import com.keystones.keystones.backend.Entity.User;
import com.keystones.keystones.backend.Entity.Permission;
import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // Temporary secret key for development
    private static final String SECRET_KEY =
            "KEYSTONE_SECRET_KEY_12345678901234567890";

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }
    	public String generateToken(User user) {

    	    // Get all permissions assigned to the user's role
    	    var permissions = user.getRole()
    	            .getPermissions()
    	            .stream()
    	            .map(Permission::getName)
    	            .toList();

    	    return Jwts.builder()
    	            .subject(user.getUserEmail())

    	            // User's role
    	            .claim("role", user.getRole().getName())

    	            // User's permissions
    	            .claim("permissions", permissions)

    	            .issuedAt(new Date())
    	            .expiration(
    	                    new Date(System.currentTimeMillis() + 1000 * 60 * 60)
    	            )
    	            .signWith(getSigningKey())
    	            .compact();
    	}
}