package com.batchable.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

// stores the pieces of the server's current hosting configuration.
// this will differ between development (http://localhost:5173) and
// production (https://batchable.org) environments, and as such is abstracted
@Configuration
public class ServerLocationConfig {
  // the protocol of the server's URL, without the ://. e.g. "http" or "https"
  @Value("${location.protocol}")
  private String protocol;

  // the host name of the server, or an IP address. e.g. "localhost" or "batchable.org" or "127.0.0.1"
  @Value("${location.host}")
  private String host;

  // the port number for the server, used even if it would normally be omitted. e.g. 443 (https) for production and 5173 for development
  @Value("${location.port}")
  private String port;

  // returns the entire 'origin' for the server's URL, without a trailing slash.
  public String getUrl() {
    return protocol + "://" + host + ":" + port;
  }
}
