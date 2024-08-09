package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;

import edu.ucsb.cs156.courses.entities.UCSBAPIQuarter;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "UCSBCurriculumController")
@RestController
@RequestMapping("/api/public")
public class UCSBCurriculumController {

  @Autowired UserRepository userRepository;
  @Autowired UCSBCurriculumService ucsbCurriculumService;

  @GetMapping(value = "/basicsearch", produces = "application/json")
  public ResponseEntity<String> basicsearch(
      @RequestParam String qtr, @RequestParam String dept, @RequestParam String level)
      throws JsonProcessingException {

    String body = ucsbCurriculumService.getJSON(dept, qtr, level);

    return ResponseEntity.ok().body(body);
  }

  @Operation(summary = "Get dates for current quarter")
  @GetMapping(value = "/currentQuarter", produces = "application/json")
  public UCSBAPIQuarter getCurrentQuarter() throws Exception {
    return ucsbCurriculumService.getCurrentQuarter();
  }
}
