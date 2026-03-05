package com.batchable.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// To avoid errors when user refreshes on a non-home url
@Controller
public class FrontendController {

  // Only forward SPA routes to index.html; do not match /assets/* or other static
  // paths
  @GetMapping(value = {"/", "/restaurant"})
  public String forward() {
    return "forward:/index.html";
  }
}
