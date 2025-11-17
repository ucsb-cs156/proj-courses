package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import edu.ucsb.cs156.courses.services.EnrollmentCSVService;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.Writer;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.opencsv.exceptions.CsvDataTypeMismatchException;

public class EnrollmentControllerTests {

  @Mock
  private EnrollmentDataPointRepository enrollmentDataPointRepository =
      mock(EnrollmentDataPointRepository.class);

  @Mock
  private EnrollmentCSVService enrollmentCSVService =
      mock(EnrollmentCSVService.class);

  @InjectMocks private EnrollmentController enrollmentController;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testCsvForQuarter_success() throws Exception {
    String yyyyq = "20252";
    EnrollmentDataPoint dataPoint =
        EnrollmentDataPoint.builder()
            .id(1L)
            .yyyyq(yyyyq)
            .courseId("CMPSC 156")
            .dateCreated(LocalDateTime.parse("2022-03-05T15:50:10"))
            .enrollment(96)
            .enrollCd("12345")
            .section("0100")
            .build();
    List<EnrollmentDataPoint> dataPoints = List.of(dataPoint);

    when(enrollmentDataPointRepository.findByYyyyq(yyyyq)).thenReturn(dataPoints);

        // mock CSV writing to produce deterministic output
        doAnswer(invocation -> {
            Writer writer = invocation.getArgument(0);
            writer.write("""
                    "COURSEID","DATECREATED","ENROLLCD","ENROLLMENT","ID","SECTION","YYYYQ"
                    "CMPSC 156","2022-03-05T15:50:10","12345","96","1","0100","20252"
                    """);
            return null;
        }).when(enrollmentCSVService).writeEnrollmentCSV(any(Writer.class), any(List.class));

        ResponseEntity<StreamingResponseBody> response =
                enrollmentController.csvForQuarter(yyyyq);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("text/csv;charset=UTF-8", response.getHeaders().getContentType().toString());
    String expectedFilename = "enrollment_" + yyyyq + ".csv";
    String expectedContentDisposition = "attachment;filename=" + expectedFilename;
    String actualContentDisposition =
        response.getHeaders().get(HttpHeaders.CONTENT_DISPOSITION).get(0);
    assertEquals(expectedContentDisposition, actualContentDisposition);

    StreamingResponseBody body = response.getBody();
    assertNotNull(body);

    OutputStream outputStream = new ByteArrayOutputStream();
    body.writeTo(outputStream);
    String csvOutput = outputStream.toString();

    String expectedCSVOutput =
        """
                "COURSEID","DATECREATED","ENROLLCD","ENROLLMENT","ID","SECTION","YYYYQ"
                "CMPSC 156","2022-03-05T15:50:10","12345","96","1","0100","20252"
                """;

    assertEquals(expectedCSVOutput, csvOutput);
  }

  @Test
  public void testCsvForQuarter_csvWriteThrowsException() throws Exception {
    String yyyyq = "20252";
    EnrollmentDataPoint dataPoint =
        EnrollmentDataPoint.builder()
            .id(1L)
            .yyyyq(yyyyq)
            .courseId("CMPSC 156")
            .dateCreated(LocalDateTime.parse("2022-03-05T15:50:10"))
            .enrollment(96)
            .enrollCd("12345")
            .section("0100")
            .build();

    List<EnrollmentDataPoint> dataPoints = List.of(dataPoint);

    when(enrollmentDataPointRepository.findByYyyyq(yyyyq)).thenReturn(dataPoints);

    // force the catch block to run
    doThrow(new CsvDataTypeMismatchException("bad type"))
        .when(enrollmentCSVService)
        .writeEnrollmentCSV(any(), anyList());

    ResponseEntity<StreamingResponseBody> response =
        enrollmentController.csvForQuarter(yyyyq);

    assertEquals("text/csv;charset=UTF-8", response.getHeaders().getContentType().toString());

    StreamingResponseBody body = response.getBody();
    assertNotNull(body);

    OutputStream outputStream = new ByteArrayOutputStream();

    try {
      body.writeTo(outputStream);
    } catch (IOException e) {
      assertEquals("Error writing CSV file: bad type", e.getMessage());
    }
  }
}
