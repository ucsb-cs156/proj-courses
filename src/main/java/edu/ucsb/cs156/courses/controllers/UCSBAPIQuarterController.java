package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.entities.UCSBAPIQuarter;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBAPIQuarterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "UCSBAPIQuarterController")
@RestController
@RequestMapping("/api/public")
@Slf4j
public class UCSBAPIQuarterController extends ApiController {

  @Autowired UserRepository userRepository;
  @Autowired UCSBAPIQuarterService ucsbAPIQuarterService;

  @Operation(summary = "Get dates for current quarter")
  @GetMapping(value = "/currentQuarter", produces = "application/json")
  public UCSBAPIQuarter getCurrentQuarter() throws Exception {
    return ucsbAPIQuarterService.getCurrentQuarter();
  }

  @Operation(summary = "Get dates for all quarters")
  @GetMapping(value = "/allQuarters", produces = "application/json")
  public List<UCSBAPIQuarter> getAllQuarters() throws Exception {
    return ucsbAPIQuarterService.getAllQuarters();
  }

  @Operation(summary = "Load quarters into database from UCSB API")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/loadQuarters")
  public List<UCSBAPIQuarter> loadQuarters() throws Exception {
    List<UCSBAPIQuarter> savedQuarters = ucsbAPIQuarterService.loadAllQuarters();
    return savedQuarters;
  }

  @Operation(summary = "Get list of active quarters")
  @GetMapping(value = "/activeQuarters", produces = "application/json")
  public List<String> activeQuarters() throws Exception {
    return ucsbAPIQuarterService.getActiveQuarters();
  }
}
