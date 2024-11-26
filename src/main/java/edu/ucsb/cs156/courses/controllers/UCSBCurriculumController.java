package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "UCSBCurriculumController")
@RestController
@RequestMapping("/api/public")
@Slf4j
public class UCSBCurriculumController extends ApiController {

  @Autowired UserRepository userRepository;
  @Autowired UCSBCurriculumService ucsbCurriculumService;

  @Operation(summary = "Get course data for a given quarter, department, and level")
  @GetMapping(value = "/basicsearch", produces = "application/json")
  public ResponseEntity<String> basicsearch(
      @RequestParam String qtr, @RequestParam String dept, @RequestParam String level)
      throws Exception {

    String body = ucsbCurriculumService.getJSON(dept, qtr, level);

    return ResponseEntity.ok().body(body);
  }

  // Backend for final exam info, similar to the above operation:
  @Operation(summary = "Get final exam information for a given quarter and course enrollment code")
  @GetMapping(value = "/finalsInfo", produces = "application/json")
  public ResponseEntity<String> finalsInfo(
      @RequestParam String quarterYYYYQ, @RequestParam String enrollCd)
      throws Exception { // Looks for quarter and code

    String body = ucsbCurriculumService.getFinalsInfo(quarterYYYYQ, enrollCd);

    return ResponseEntity.ok().body(body);
  }
}
