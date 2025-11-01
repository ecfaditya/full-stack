package com.example.chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// Main Application
@SpringBootApplication
public class ChatApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChatApplication.class, args);
    }

    // ---------------- WebSocket Configuration ----------------
    @Configuration
    @EnableWebSocketMessageBroker
    public static class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

        @Override
        public void configureMessageBroker(MessageBrokerRegistry config) {
            config.enableSimpleBroker("/topic"); // broadcast messages to subscribers
            config.setApplicationDestinationPrefixes("/app"); // prefix for client messages
        }

        @Override
        public void registerStompEndpoints(StompEndpointRegistry registry) {
            registry.addEndpoint("/chat-websocket").setAllowedOriginPatterns("*").withSockJS();
        }
    }

    // ---------------- Chat Message Model ----------------
    public static class ChatMessage {
        private String sender;
        private String content;

        public ChatMessage() {}

        public ChatMessage(String sender, String content) {
            this.sender = sender;
            this.content = content;
        }

        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    // ---------------- Chat Controller ----------------
    @Controller
    public static class ChatController {

        // Receive message from client and broadcast to /topic/messages
        @MessageMapping("/sendMessage")
        @SendTo("/topic/messages")
        public ChatMessage sendMessage(ChatMessage message) {
            // Here you could also persist messages to a database
            return message;
        }

        // Simple endpoint to test server is running
        @RestController
        public static class TestController {
            @GetMapping("/ping")
            public String ping() {
                return "Chat server is running!";
            }
        }
    }
}
