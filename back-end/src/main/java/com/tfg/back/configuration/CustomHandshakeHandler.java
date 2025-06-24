package com.tfg.back.configuration;

import com.tfg.back.service.impl.MyUserDetailsService;
import com.tfg.back.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {

        try {
            String token = extractTokenFromRequest(request);
            System.out.println("Extracted token: " + (token != null ? "Found (length: " + token.length() + ")" : "NULL"));

            if (token != null && !token.isEmpty()) {
                String userId = jwtUtil.extractUsername(token);

                UserDetails userDetails = userDetailsService.loadUserByUsername(UUID.fromString(userId));

                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    return auth;
                } else {
                    System.out.println("Token validation failed");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("Returning null principal");
        return null;
    }

    private String extractTokenFromRequest(ServerHttpRequest request) {
        List<String> authHeaders = request.getHeaders().get("Authorization");
        if (authHeaders != null && !authHeaders.isEmpty()) {
            String authHeader = authHeaders.get(0);
            if (authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7);
            }
        }

        String query = request.getURI().getQuery();
        if (query != null) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2 && "token".equals(keyValue[0])) {
                    try {
                        return java.net.URLDecoder.decode(keyValue[1], "UTF-8");
                    } catch (Exception e) {
                        System.err.println("Error decoding token: " + e.getMessage());
                    }
                }
            }
        }

        return null;
    }
}
