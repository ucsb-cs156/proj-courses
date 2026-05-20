package edu.ucsb.cs156.courses.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestErrorController {

  @GetMapping("/test-error")
  public String testError() {
    throw new RuntimeException("This is a test exception to trigger the custom error page");
  }
}
