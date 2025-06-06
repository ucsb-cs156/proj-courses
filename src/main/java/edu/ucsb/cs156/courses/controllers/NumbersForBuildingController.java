package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/classrooms")
public class NumbersForBuildingController {

  private ObjectMapper mapper = new ObjectMapper();

  @Autowired private ConvertedSectionCollection convertedSectionCollection;

  @Operation(summary = "Get a list of room numbers for a specific building and quarter")
  @GetMapping(value = "/roomnumbers", produces = "application/json")
  public ResponseEntity<String> getRoomNumbers(
      @Parameter(
              name = "quarter",
              description =
                  "Quarter in yyyyq format, e.g. 20231 for W23, 20232 for S23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
              example = "20231",
              required = true)
          @RequestParam
          String quarter,
      @Parameter(
              name = "buildingCode",
              description = "Building code such as PHELP for Phelps, GIRV for Girvetz",
              example = "GIRV",
              required = true)
          @RequestParam
          String buildingCode)
      throws JsonProcessingException {
    List<ConvertedSection> sections =
        convertedSectionCollection.findByQuarterRangeAndBuildingCode(
            quarter, quarter, buildingCode);

    Set<String> roomNumbers =
        sections.stream()
            .flatMap(section -> section.getSection().getTimeLocations().stream())
            .filter(timeLocation -> buildingCode.equalsIgnoreCase(timeLocation.getBuilding()))
            .map(timeLocation -> timeLocation.getRoom())
            .collect(Collectors.toSet());

    String body = mapper.writeValueAsString(roomNumbers);
    return ResponseEntity.ok().body(body);
  }
}
