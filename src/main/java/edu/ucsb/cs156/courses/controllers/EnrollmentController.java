package edu.ucsb.cs156.courses.controllers;

import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
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
@Tag(name = "API for enrollment data")
@RequestMapping("/api/enrollment")
@RestController
public class EnrollmentController extends ApiController {

  @Autowired EnrollmentDataPointRepository enrollmentDataPointRepository;

  @Operation(
      summary = "Download Enrollment Data as CSV File",
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
  @GetMapping(value = "/csv/quarter", produces = "text/csv")
  public ResponseEntity<StreamingResponseBody> csvForQuarter(
      @Parameter(name = "yyyyq", description = "quarter in yyyyq format", example = "20252")
          @RequestParam
          String yyyyq,
      @Parameter(
              name = "testException",
              description = "test exception (e.g. CsvDataTypeMismatchException)",
              example = "")
          @RequestParam(required = false, defaultValue = "")
          String testException)
      throws Exception, IOException {
    StreamingResponseBody stream =
        (outputStream) -> {
          Iterable<EnrollmentDataPoint> iterable = enrollmentDataPointRepository.findByYyyyq(yyyyq);
          List<EnrollmentDataPoint> list = Streamable.of(iterable).toList();

          try (Writer writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)) {
            try {
              if (testException.equals("CsvDataTypeMismatchException")) {
                throw new CsvDataTypeMismatchException("test exception");
              }
              new StatefulBeanToCsvBuilder<EnrollmentDataPoint>(writer).build().write(list);
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
            String.format("attachment;filename=enrollment_%s.csv", yyyyq))
        .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
        .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
        .body(stream);
  }
}
