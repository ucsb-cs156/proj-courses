package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import edu.ucsb.cs156.courses.models.EnrollmentCSV;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import edu.ucsb.cs156.courses.services.EnrollmentCSVService;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

public class EnrollmentControllerTests {

  @Mock private EnrollmentDataPointRepository enrollmentDataPointRepository;

  @Mock private EnrollmentCSVService enrollmentCSVService;

  @Mock private StatefulBeanToCsv<EnrollmentCSV> mockWriter;

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
            .section("0100")
            .enrollCd("12345")
            .enrollment(96)
            .dateCreated(LocalDateTime.parse("2022-03-05T15:50:10"))
            .build();

    when(enrollmentDataPointRepository.findByYyyyq(yyyyq)).thenReturn(List.of(dataPoint));
    when(enrollmentCSVService.getStatefulBeanToCSV(any())).thenReturn(mockWriter);

    ResponseEntity<StreamingResponseBody> response = enrollmentController.csvForQuarter(yyyyq);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("text/csv;charset=UTF-8", response.getHeaders().getContentType().toString());

    String expectedFilename = "attachment;filename=enrollment_" + yyyyq + ".csv";
    assertEquals(
        expectedFilename, response.getHeaders().get(HttpHeaders.CONTENT_DISPOSITION).get(0));

    StreamingResponseBody body = response.getBody();
    assertNotNull(body);

    // Execute stream
    OutputStream outputStream = new ByteArrayOutputStream();
    body.writeTo(outputStream);

    verify(mockWriter, atLeastOnce()).write(any(List.class));
  }

  @Test
  public void testCsvForQuarter_emptyResults() throws Exception {
    String yyyyq = "20252";

    when(enrollmentDataPointRepository.findByYyyyq(yyyyq)).thenReturn(List.of());
    when(enrollmentCSVService.getStatefulBeanToCSV(any())).thenReturn(mockWriter);

    ResponseEntity<StreamingResponseBody> response = enrollmentController.csvForQuarter(yyyyq);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());

    OutputStream outputStream = new ByteArrayOutputStream();
    response.getBody().writeTo(outputStream);

    verify(mockWriter, atLeastOnce()).write(any(List.class));
  }

  @Test
  public void testCsvForQuarter_writerThrowsException() throws Exception {
    String yyyyq = "20252";

    EnrollmentDataPoint dataPoint =
        EnrollmentDataPoint.builder()
            .id(1L)
            .yyyyq(yyyyq)
            .courseId("CMPSC 156")
            .section("0100")
            .enrollCd("12345")
            .enrollment(96)
            .dateCreated(LocalDateTime.now())
            .build();

    when(enrollmentDataPointRepository.findByYyyyq(yyyyq)).thenReturn(List.of(dataPoint));

    // Mock CSV service to throw exception when writer writes
    doThrow(new RuntimeException("CSV write failed")).when(mockWriter).write(any(List.class));
    when(enrollmentCSVService.getStatefulBeanToCSV(any())).thenReturn(mockWriter);

    StreamingResponseBody body = enrollmentController.csvForQuarter(yyyyq).getBody();
    assertNotNull(body);

    // When writing, RuntimeException will propagate
    assertThrows(RuntimeException.class, () -> body.writeTo(new ByteArrayOutputStream()));

    verify(mockWriter, atLeastOnce()).write(any(List.class));
  }

  @Test
  public void testCsvForQuarter_csvExceptionsThrown() throws Exception {
    String yyyyq = "20252";

    EnrollmentDataPoint dataPoint =
        EnrollmentDataPoint.builder()
            .id(1L)
            .yyyyq(yyyyq)
            .courseId("CMPSC 156")
            .section("0100")
            .enrollCd("12345")
            .enrollment(96)
            .dateCreated(LocalDateTime.now())
            .build();

    when(enrollmentDataPointRepository.findByYyyyq(yyyyq)).thenReturn(List.of(dataPoint));

    // Mock CSV writer to throw CsvDataTypeMismatchException
    doThrow(new CsvDataTypeMismatchException("bad data")).when(mockWriter).write(any(List.class));

    when(enrollmentCSVService.getStatefulBeanToCSV(any())).thenReturn(mockWriter);

    StreamingResponseBody body = enrollmentController.csvForQuarter(yyyyq).getBody();

    IOException ex =
        assertThrows(IOException.class, () -> body.writeTo(new ByteArrayOutputStream()));
    assertTrue(ex.getMessage().contains("Error writing CSV file"));
  }

  @Test
  public void testCsvForQuarter_mappingProducesNonNullValues() throws Exception {
    String yyyyq = "20252";

    EnrollmentDataPoint dp =
        EnrollmentDataPoint.builder()
            .id(1L)
            .yyyyq(yyyyq)
            .courseId("CMPSC 156")
            .section("0100")
            .enrollCd("12345")
            .enrollment(42)
            .dateCreated(LocalDateTime.now())
            .build();

    when(enrollmentDataPointRepository.findByYyyyq(yyyyq)).thenReturn(List.of(dp));
    when(enrollmentCSVService.getStatefulBeanToCSV(any())).thenReturn(mockWriter);

    // Run controller
    StreamingResponseBody body = enrollmentController.csvForQuarter(yyyyq).getBody();
    body.writeTo(new ByteArrayOutputStream());

    // Capture list passed to writer
    ArgumentCaptor<List<EnrollmentCSV>> captor = ArgumentCaptor.forClass(List.class);
    verify(mockWriter).write(captor.capture());

    List<EnrollmentCSV> rows = captor.getValue();

    assertEquals(1, rows.size());
    assertNotNull(rows.get(0), "CSV row must not be null"); // <-- kills null return mutation
    assertEquals("CMPSC 156", rows.get(0).getCourseId());
    assertEquals("0100", rows.get(0).getSection());
    assertEquals("12345", rows.get(0).getEnrollCd());
  }
}
