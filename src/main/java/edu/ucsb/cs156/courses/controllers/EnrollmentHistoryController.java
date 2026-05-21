package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Tag(name = "API for enrollment data")
// FIX 1: Remove the trailing slash here!
@RequestMapping("/api/public/enrollmenthistory")
@RestController
public class EnrollmentHistoryController extends ApiController {

  @Autowired EnrollmentDataPointRepository enrollmentDataPointRepository;

  @Operation(summary = "Get a list of Enrollment History DataPoints as JSON")
  @GetMapping(value = "/search", produces = "application/json")
  public Iterable<EnrollmentDataPoint> getDataPointsForQuarter(
      @Parameter(name = "yyyyq", description = "quarter in yyyyq format", example = "20252")
          @RequestParam
          String yyyyq,
      @Parameter(
              name = "subjectArea",
              description = "simplified area name",
              example = "CMPSC",
              required = true)
          @RequestParam
          String subjectArea,
      @Parameter(
              name = "courseNumber",
              description = "the specific course number",
              example = "130A",
              required = true)
          @RequestParam
          String courseNumber) {

    String formattedCourseId = makeFormattedCourseId(subjectArea, courseNumber);

    Iterable<EnrollmentDataPoint> allPointsForQuarter =
        enrollmentDataPointRepository.findByYyyyq(yyyyq);

    List<EnrollmentDataPoint> matchingPoints = new ArrayList<>();
    for (EnrollmentDataPoint point : allPointsForQuarter) {
      if (point.getCourseId().equals(formattedCourseId)) {
        matchingPoints.add(point);
      }
    }

    return matchingPoints;
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
