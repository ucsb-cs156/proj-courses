package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/courseovertime")
public class CourseOverTimeBuildingController {

  private ObjectMapper mapper = new ObjectMapper();

  @Autowired ConvertedSectionCollection convertedSectionCollection;

  @Operation(summary = "Get a list of courses over time, filtered by (abbreviated) building code")
  @GetMapping(value = "/buildingsearch", produces = "application/json")
  public ResponseEntity<String> search(
      @Parameter(
              name = "startQtr",
              description =
                  "Starting quarter in yyyyq format, e.g. 20232 for S23, 20234 for F23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
              example = "20232",
              required = true)
          @RequestParam
          String startQtr,
      @Parameter(
              name = "endQtr",
              description =
                  "Ending quarter in yyyyq format, e.g. 20232 for S23, 20234 for F23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
              example = "20232",
              required = true)
          @RequestParam
          String endQtr,
      @Parameter(
              name = "buildingCode",
              description = "Building code such as PHELP for Phelps, GIRV for Girvetz",
              example = "GIRV",
              required = true)
          @RequestParam
          String buildingCode,
      @Parameter(
              name = "classroom",
              description = "Classroom number",
              example = "1431",
              required = false)
          @RequestParam(required = false, defaultValue = "")
          String classroom)
      throws JsonProcessingException {
    List<ConvertedSection> courseResults =
        new java.util.ArrayList<>(
            convertedSectionCollection.findByQuarterRangeAndBuildingCode(
                startQtr, endQtr, buildingCode));

    if (!classroom.isEmpty() && !classroom.equals("ALL")) {
      courseResults =
          courseResults.stream()
              .filter(
                  result ->
                      result.getSection() != null
                          && result.getSection().getTimeLocations() != null
                          && result.getSection().getTimeLocations().stream()
                              .anyMatch(
                                  loc ->
                                      loc.getBuilding() != null
                                          && loc.getBuilding().equalsIgnoreCase(buildingCode)
                                          && loc.getRoom() != null
                                          && loc.getRoom().equals(classroom)))
              .collect(Collectors.toList());
    }

    courseResults.sort(new ConvertedSection.ConvertedSectionSortDescendingByQuarterComparator());

    String body = mapper.writeValueAsString(courseResults);

    return ResponseEntity.ok().body(body);
  }

  @Operation(
      summary =
          "Get a list of classroom numbers within a particular building, given a quarter and building code")
  @GetMapping(value = "/buildingsearch/classrooms", produces = "application/json")
  public ResponseEntity<String> searchNew(
      @Parameter(
              name = "quarter",
              description =
                  "Quarter in yyyyq format, e.g. 20232 for S23, 20234 for F23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
              example = "20232",
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
    List<ConvertedSection> courseResults =
        convertedSectionCollection.findByQuarterAndBuildingCode(quarter, buildingCode);

    Set<String> classrooms =
        courseResults.stream()
            .flatMap(
                result -> {
                  if (result.getSection() != null
                      && result.getSection().getTimeLocations() != null) {
                    return result.getSection().getTimeLocations().stream();
                  } else {
                    return Stream.empty();
                  }
                })
            .filter(
                loc ->
                    loc.getBuilding() != null && loc.getBuilding().equalsIgnoreCase(buildingCode))
            .map(loc -> loc.getRoom())
            .filter(room -> room != null && !room.isEmpty())
            .collect(Collectors.toCollection(TreeSet::new));

    String body = mapper.writeValueAsString(classrooms);
    return ResponseEntity.ok().body(body);
  }
}
