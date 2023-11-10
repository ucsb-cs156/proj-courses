package edu.ucsb.cs156.courses.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Profile;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("development")
@Tag(name = "CSRF (enabled only in development; can be used with Postman to test APIs)")
@RestController
public class CSRFController {
  @Operation(summary = "Get a CSRF Token")
  @GetMapping("/csrf")
  public CsrfToken csrf(CsrfToken token) {
    return token;
  }
}
