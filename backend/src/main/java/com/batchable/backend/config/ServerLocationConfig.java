package com.batchable.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class ServerLocationConfig {
  @Value("${location.protocol}")
  private String protocol;

  @Value("${location.host}")
  private String host;

  @Value("${location.port}")
  private String port;

  public String getUrl() {
    return protocol + "://" + host + ":" + port;
  }
}
