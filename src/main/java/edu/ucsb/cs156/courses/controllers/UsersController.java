package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User information (admin only)")
@RequestMapping("/api/admin/users")
@RestController
public class UsersController extends ApiController {
  @Autowired UserRepository userRepository;

  @Autowired ObjectMapper mapper;

  @Operation(summary = "Get a list of all users")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping("")
  public ResponseEntity<String> users() throws JsonProcessingException {
    Iterable<User> users = userRepository.findAll();
    String body = mapper.writeValueAsString(users);
    return ResponseEntity.ok().body(body);
  }
}
