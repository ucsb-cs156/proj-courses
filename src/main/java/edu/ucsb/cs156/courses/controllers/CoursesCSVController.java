package edu.ucsb.cs156.courses.controllers;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.models.SectionCSVLine;
import edu.ucsb.cs156.courses.services.SectionCSVLineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Streamable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@Slf4j
@Tag(name = "API for course data as CSV downloads")
@RequestMapping("/api/courses/csv")
@RestController
public class CoursesCSVController extends ApiController {

  @Autowired ConvertedSectionCollection convertedSectionCollection;

  @Autowired private SectionCSVLineService sectionCsvLineService;

  @Operation(
      summary = "Download Complete Course List for a quarter as a CSV File",
      description = "Returns a CSV file as a response",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "CSV file",
            content =
                @Content(
                    mediaType = "text/csv",
                    schema = @Schema(type = "string", format = "binary"))),
        @ApiResponse(responseCode = "500", description = "Internal Server Error")
      })
  @GetMapping(value = "/quarter", produces = "text/csv")
  public ResponseEntity<StreamingResponseBody> csvForCourses(
      @Parameter(name = "yyyyq", description = "quarter in yyyyq format", example = "20252")
          @RequestParam
          String yyyyq)
      throws Exception, IOException {
    StreamingResponseBody stream =
        (outputStream) -> {
          Iterable<ConvertedSection> iterable = convertedSectionCollection.findByQuarter(yyyyq);

          List<SectionCSVLine> list =
              Streamable.of(iterable).toList().stream()
                  .map(
                      section -> {
                        return SectionCSVLine.toSectionCSVLine(section);
                      })
                  .collect(Collectors.toList());

          try (Writer writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)) {
            try {
              StatefulBeanToCsv<SectionCSVLine> beanToCsvWriter =
                  sectionCsvLineService.getStatefulBeanToCSV(writer);
              beanToCsvWriter.write(list);
            } catch (CsvDataTypeMismatchException | CsvRequiredFieldEmptyException e) {
              log.error("Error writing CSV file", e);
              throw new IOException("Error writing CSV file: " + e.getMessage());
            }
          }
        };

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            String.format("attachment;filename=courses_%s.csv", yyyyq))
        .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
        .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
        .body(stream);
  }

  @Operation(
      summary = "Download Course List for a subject area and quarter as a CSV File",
      description = "Returns a CSV file as a response",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "CSV file",
            content =
                @Content(
                    mediaType = "text/csv",
                    schema = @Schema(type = "string", format = "binary"))),
        @ApiResponse(responseCode = "500", description = "Internal Server Error")
      })
  @GetMapping(value = "/byQuarterAndSubjectArea", produces = "text/csv")
  public ResponseEntity<StreamingResponseBody> csvForCoursesQuarterAndSubjectArea(
      @Parameter(name = "yyyyq", description = "quarter in yyyyq format", example = "20261")
          @RequestParam
          String yyyyq,
      @Parameter(name = "subjectArea", description = "subject area", example = "CMPSC")
          @RequestParam
          String subjectArea,
      @Parameter(
              name = "level",
              description = "U for undergrad, G for graduate, A for all (default: U)",
              example = "",
              schema =
                  @Schema(
                      type = "string",
                      allowableValues = {"A", "U", "G"}))
          @RequestParam(defaultValue = "U")
          String level,
      @Parameter(name = "omitSections", description = "omit sections", example = "true")
          @RequestParam(defaultValue = "true")
          boolean omitSections,
      @Parameter(
              name = "withTimeLocations",
              description =
                  "return only courses that have times and/or locations assigned (e.g. no independent study type courses)",
              example = "true")
          @RequestParam(defaultValue = "true")
          boolean withTimeLocations)
      throws Exception, IOException {

    // String formattedSubjectArea = String.format("'%8s'", subjectArea);
    StreamingResponseBody stream =
        (outputStream) -> {
          String sectionRegex = omitSections ? "00$" : ".*";
          String courseLevelRegex =
              level.equals("A") ? "" : level.equals("G") ? "[23456789]" : "[ 1]";
          String courseIdRegex = String.format("^%-8s", subjectArea) + courseLevelRegex;
          Iterable<ConvertedSection> iterable =
              convertedSectionCollection.findByQuarterAndSubjectArea(
                  yyyyq, courseIdRegex, sectionRegex, withTimeLocations ? 1 : 0);

          log.info(
              "Found {} sections for quarter {} and courseIdRegex <{}> and sectionRegex <{}>",
              Streamable.of(iterable).toList().size(),
              yyyyq,
              courseIdRegex,
              sectionRegex);

          List<SectionCSVLine> list =
              Streamable.of(iterable).toList().stream()
                  .map(
                      section -> {
                        return SectionCSVLine.toSectionCSVLine(section);
                      })
                  .collect(Collectors.toList());

          try (Writer writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)) {
            try {
              StatefulBeanToCsv<SectionCSVLine> beanToCsvWriter =
                  sectionCsvLineService.getStatefulBeanToCSV(writer);
              beanToCsvWriter.write(list);
            } catch (CsvDataTypeMismatchException | CsvRequiredFieldEmptyException e) {
              log.error("Error writing CSV file", e);
              throw new IOException("Error writing CSV file: " + e.getMessage());
            }
          }
        };

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            String.format("attachment;filename=courses_%s.csv", yyyyq))
        .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
        .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
        .body(stream);
  }
}
