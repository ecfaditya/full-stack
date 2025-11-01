package com.example.jwtbank;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;

@SpringBootApplication
public class JwtBankApplication {

    public static void main(String[] args) {
        SpringApplication.run(JwtBankApplication.class, args);
    }

    // JWT Utility
    public static class JwtUtil {
        private static final String SECRET_KEY = "my-super-secret-key";
        private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

        public static String generateToken(String username) {
            return Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                    .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                    .compact();
        }

        public static String validateToken(String token) {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        }
    }

    // JWT Filter for logging and authentication
    public static class JwtAuthFilter extends HttpFilter {

        @Override
        protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                throws IOException, ServletException {

            // Logging
            System.out.println("Incoming request: " + request.getMethod() + " " + request.getRequestURI());

            // Skip auth for login route
            if (request.getRequestURI().startsWith("/auth/login")) {
                chain.doFilter(request, response);
                return;
            }

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Missing or invalid Authorization header");
                return;
            }

            String token = authHeader.substring(7);
            try {
                String username = JwtUtil.validateToken(token);
                request.setAttribute("username", username);
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or expired token");
                return;
            }

            chain.doFilter(request, response);
        }
    }

    // Register Filter
    @Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtFilter() {
        FilterRegistrationBean<JwtAuthFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new JwtAuthFilter());
        registrationBean.addUrlPatterns("/bank/*"); // Protect banking routes
        return registrationBean;
    }

    // Authentication Controller
    @RestController
    @RequestMapping("/auth")
    public static class AuthController {

        @PostMapping("/login")
        public String login(@RequestParam String username, @RequestParam String password) {
            // Dummy authentication; replace with DB check
            if ("user".equals(username) && "password".equals(password)) {
                return JwtUtil.generateToken(username);
            } else {
                throw new RuntimeException("Invalid credentials");
            }
        }
    }

    // Protected Banking Controller
    @RestController
    @RequestMapping("/bank")
    public static class BankController {

        @GetMapping("/balance")
        public String getBalance(HttpServletRequest request) {
            String username = (String) request.getAttribute("username");
            return "Hello " + username + ", your account balance is $10,000";
        }

        @GetMapping("/transactions")
        public String getTransactions(HttpServletRequest request) {
            String username = (String) request.getAttribute("username");
            return "Transactions for " + username + ": [Tx1, Tx2, Tx3]";
        }
    }
}
