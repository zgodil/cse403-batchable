package com.batchable.backend.twilio;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;

/**
 * Security configuration: permits SPA and Twilio endpoints without auth,
 * requires JWT for all /api/* (except send-text, receive-text).
 * SSE (/sse/**) requires JWT; token may be sent as query param ?access_token= for EventSource.
 */
@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    DefaultBearerTokenResolver bearerTokenResolver = new DefaultBearerTokenResolver();
    bearerTokenResolver.setAllowUriQueryParameter(true); // for SSE: EventSource cannot set headers

    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            // SPA: allow loading the app and assets
            .requestMatchers("/", "/restaurant", "/restaurant/**", "/index.html", "/assets/**")
            .permitAll()
            // Twilio webhooks and SMS endpoints
            .requestMatchers("/api/send-text", "/api/receive-text", "/twilio/**")
            .permitAll()
            // All other API requests require JWT
            .anyRequest()
            .authenticated())
        .oauth2ResourceServer(oauth2 -> oauth2
            .bearerTokenResolver(bearerTokenResolver)
            .jwt(Customizer.withDefaults()));

    return http.build();
  }
}
