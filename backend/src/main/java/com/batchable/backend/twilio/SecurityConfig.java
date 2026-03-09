package com.batchable.backend.twilio;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    DefaultBearerTokenResolver bearerTokenResolver = new DefaultBearerTokenResolver();
    // EventSource cannot set Authorization headers; allow ?access_token=... for SSE.
    bearerTokenResolver.setAllowUriQueryParameter(true);

    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/", "/restaurant", "/index.html", "/assets/**", "/favicon.ico")
            .permitAll()
            .requestMatchers("/send-text", "/receive-text", "/twilio/**")
            .permitAll()
            .anyRequest().authenticated())
        .oauth2ResourceServer(oauth2 -> oauth2
            .bearerTokenResolver(bearerTokenResolver)
            .jwt(Customizer.withDefaults()));

    return http.build();
  }
}
