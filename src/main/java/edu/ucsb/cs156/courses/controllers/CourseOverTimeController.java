package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/courseovertime")
public class CourseOverTimeController {

  private final Logger logger = LoggerFactory.getLogger(CourseOverTimeController.class);

  private ObjectMapper mapper = new ObjectMapper();

  @Autowired ConvertedSectionCollection convertedSectionCollection;

  @Operation(summary = "Get a list of courses over time")
  @GetMapping(value = "/search", produces = "application/json")
  public ResponseEntity<String> search(
      @Parameter(
              name = "startQtr",
              description =
                  "starting quarter in yyyyq format, e.g. 20231 for W23, 20232 for S23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
              example = "20231",
              required = true)
          @RequestParam
          String startQtr,
      @Parameter(
              name = "endQtr",
              description =
                  "ending quarter in yyyyq format, e.g. 20231 for W23, 20232 for S23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
              example = "20231",
              required = true)
          @RequestParam
          String endQtr,
      @Parameter(
              name = "subjectArea",
              description = "simplified area name, e.g. CMPSC for computer science",
              example = "CMPSC",
              required = true)
          @RequestParam
          String subjectArea,
      @Parameter(
              name = "courseNumber",
              description = "the specific course number, e.g. 130A for CS130A",
              example = "130A",
              required = true)
          @RequestParam
          String courseNumber)
      throws JsonProcessingException {
    List<ConvertedSection> courseResults =
        convertedSectionCollection.findByQuarterRangeAndCourseId(
            startQtr, endQtr, makeFormattedCourseId(subjectArea, courseNumber));
    String body = mapper.writeValueAsString(courseResults);
    return ResponseEntity.ok().body(body);
  }

  String makeFormattedCourseId(String subjectArea, String courseNumber) {
    String[] nums = courseNumber.split("[a-zA-Z]+");
    String[] suffs = courseNumber.split("[0-9]+");
    if (suffs.length < 2) { // no suffix
      return String.format("%-8s", subjectArea) // 'CMPSC   '
          + String.format("%3s", nums[0]) // '  8'
      ;
    }
    return String.format("%-8s", subjectArea) // 'CMPSC   '
        + String.format("%3s", nums[0]) // '  8'
        + String.format("%-2s", suffs[1]) // 'A '
    ;
  }
}
