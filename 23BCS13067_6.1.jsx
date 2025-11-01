package com.example.middleware;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

// Middleware filter for logging and authentication
@Component
public class LoggingAndAuthFilter extends HttpFilter {

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // 1. Logging Request Info
        System.out.println("Incoming request: " + request.getMethod() + " " + request.getRequestURI());

        // 2. Check Bearer Token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(7); // Extract token after "Bearer "

        // Simple token validation (replace with real logic)
        if (!validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
            return;
        }

        // 3. Pass control to the next middleware or endpoint
        chain.doFilter(request, response);
    }

    // Dummy token validation function
    private boolean validateToken(String token) {
        // For demo purposes, only "my-secret-token" is valid
        return "my-secret-token".equals(token);
    }
}
