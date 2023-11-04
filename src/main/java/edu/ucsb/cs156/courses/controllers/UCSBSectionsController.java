package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sections")
public class UCSBSectionsController {
  private final Logger logger = LoggerFactory.getLogger(UCSBSectionsController.class);

  private ObjectMapper mapper = new ObjectMapper();

  @Autowired UserRepository userRepository;

  @Autowired UCSBCurriculumService ucsbCurriculumService;

  @GetMapping(value = "/basicsearch", produces = "application/json")
  public ResponseEntity<String> basicsearch(
      @RequestParam String qtr, @RequestParam String dept, @RequestParam String level)
      throws JsonProcessingException {

    String body = ucsbCurriculumService.getSectionJSON(dept, qtr, level);

    return ResponseEntity.ok().body(body);
  }

  @GetMapping(value = "/sectionsearch", produces = "application/json")
  public ResponseEntity<String> sectionsearch(
      @RequestParam String qtr, @RequestParam String enrollCode) {

    String body = ucsbCurriculumService.getSection(enrollCode, qtr);

    return ResponseEntity.ok().body(body);
  }
}
