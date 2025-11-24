package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import edu.ucsb.cs156.courses.services.EnrollmentDataPointCSVService;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

public class EnrollmentControllerTests {

  @Mock
  private EnrollmentDataPointRepository enrollmentDataPointRepository =
      mock(EnrollmentDataPointRepository.class);

  @Spy private EnrollmentDataPointCSVService enrollmentDataPointCSVService;

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

    ResponseEntity<StreamingResponseBody> response = enrollmentController.csvForQuarter(yyyyq);

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
}
