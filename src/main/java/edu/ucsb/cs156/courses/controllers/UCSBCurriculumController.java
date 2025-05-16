package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
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

  @GetMapping(value = "/generalEducationInfo", produces = "application/json")
  public List<String> getGeneralEducationAreas() {
    List<String> geAreas =
        List.of(
            "A1", // English Reading and Composition (Part 1)
            "A2", // English Reading and Composition (Part 2)
            "B", // Foreign Language
            "C", // Science, Mathematics, and Technology
            "D", // Social Sciences
            "E", // Culture and Thought
            "F", // Arts
            "G", // Literature
            "H", // Foreign Language
            "WRT", // Writing
            "QR", // Quantitative Reasoning
            "ETH", // Ethnicity
            "EUR", // European Traditions
            "NWC", // World Cultures
            "AMH" // American History and Institutions
            );
    return geAreas;
  }

  /*
   * Definitions
   *
   * Areas of GE:
   *
   * Area A - English Reading and Composition
   * Area B - Foreign Language
   * Area C - Science, Mathematics, and Technology
   * Area D - Social Science
   * Area E - Culture and Thought
   * Area F - Arts
   * Area G - Literature
   *
   * Writing (A1 & A2)  -->> This is different from Area A
   * European Traditions
   * World Cultures
   * Quantitative Relationships
   * Ethnicity
   * American History and Institutions
   */
}
