package com.keystones.keystones.backend.Security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // =========================================================
    // SECRET KEY
    // =========================================================

    private static final String SECRET_KEY =
            "KEYSTONE_SECRET_KEY_12345678901234567890";

    // =========================================================
    // JWT FILTER
    // =========================================================

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // =====================================================
        // 1. Get Authorization Header
        // =====================================================

        String authorizationHeader =
                request.getHeader("Authorization");

        // No JWT token
        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // =====================================================
        // 2. Extract JWT Token
        // =====================================================

        String token = authorizationHeader.substring(7).trim();

        // Empty token
        if (token.isEmpty()) {

            filterChain.doFilter(request, response);
            return;
        }

        try {

            // =================================================
            // 3. Parse and Validate JWT
            // =================================================

            Claims claims = Jwts.parser()
                    .verifyWith(
                            Keys.hmacShaKeyFor(
                                    SECRET_KEY.getBytes(
                                            StandardCharsets.UTF_8)
                            )
                    )
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // =================================================
            // 4. Get Email / Subject
            // =================================================

            String email = claims.getSubject();

            if (email == null || email.isBlank()) {

                System.out.println(
                        "JWT rejected: subject/email is missing"
                );

                filterChain.doFilter(request, response);
                return;
            }

            // =================================================
            // 5. Get Role
            // =================================================

            String role = claims.get("role", String.class);
            System.out.println("JWT DEBUG EMAIL: " + email);
            System.out.println("JWT DEBUG ROLE: " + role);
            System.out.println("JWT DEBUG PERMISSIONS: " + claims.get("permissions"));

            // =================================================
            // 6. Create Authorities
            // =================================================

            List<SimpleGrantedAuthority> authorities =
                    new ArrayList<>();

            // -------------------------------------------------
            // Add Role Authority
            // Example:
            // ADMIN -> ROLE_ADMIN
            // DISPATCHER -> ROLE_DISPATCHER
            // TECHNICIAN -> ROLE_TECHNICIAN
            // CUSTOMER -> ROLE_CUSTOMER
            // -------------------------------------------------

            if (role != null && !role.isBlank()) {

                authorities.add(
                        new SimpleGrantedAuthority(
                                "ROLE_" + role
                        )
                );
            }

            // =================================================
            // 7. Get Permissions
            // =================================================

            Object permissionsClaim =
                    claims.get("permissions");

            if (permissionsClaim instanceof List<?> permissionsList) {

                for (Object permissionObject : permissionsList) {

                    if (permissionObject instanceof String permission
                            && !permission.isBlank()) {

                        authorities.add(
                                new SimpleGrantedAuthority(permission)
                        );
                    }
                }
            }

            // =================================================
            // 8. Check Existing Authentication
            // =================================================

            if (SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                // =============================================
                // 9. Create Authentication Object
                // =============================================

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                authorities
                        );

                // =============================================
                // 10. Add Request Details
                // =============================================

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // =============================================
                // 11. Set Authentication
                // =============================================

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                // =============================================
                // 12. Debug Information
                // =============================================

                System.out.println(
                        "========================================"
                );

                System.out.println(
                        "JWT Authentication Successful"
                );

                System.out.println(
                        "Email: " + email
                );

                System.out.println(
                        "Role: " +
                        (role != null
                                ? "ROLE_" + role
                                : "NONE")
                );

                System.out.println(
                        "Authorities: " + authorities
                );

                System.out.println(
                        "========================================"
                );
            }

        } catch (Exception e) {

            // =================================================
            // Invalid / Expired / Malformed JWT
            // =================================================

            System.out.println(
                    "JWT Authentication Failed"
            );

            System.out.println(
                    "Reason: " + e.getMessage()
            );

            // Clear any existing authentication
            SecurityContextHolder
                    .clearContext();
        }

        // =====================================================
        // 13. Continue Filter Chain
        // =====================================================

        filterChain.doFilter(request, response);
    }
}