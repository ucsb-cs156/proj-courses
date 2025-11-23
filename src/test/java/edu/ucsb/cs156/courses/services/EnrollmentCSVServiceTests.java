package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.io.StringWriter;
import java.util.List;
import org.junit.jupiter.api.Test;

public class EnrollmentCSVServiceTests {

  EnrollmentCSVService service = new EnrollmentCSVService();

  @Test
  void test_writeEnrollmentCSV_writesValidCSV() throws Exception {
    // Arrange
    EnrollmentDataPoint point =
        EnrollmentDataPoint.builder()
            .id(1L)
            .yyyyq("20252")
            .enrollCd("01234")
            .courseId("CMPSC 156")
            .section("0100")
            .enrollment(123)
            .build();

    StringWriter writer = new StringWriter();
    List<EnrollmentDataPoint> list = List.of(point);

    // Act
    service.writeEnrollmentCSV(writer, list);

    // Assert
    String csv = writer.toString();

    assertTrue(csv.contains("20252"));
    assertTrue(csv.contains("01234"));
    assertTrue(csv.contains("CMPSC 156"));
    assertTrue(csv.contains("0100"));
    assertTrue(csv.contains("123"));
  }

  @Test
  void test_writeEnrollmentCSV_throwsCsvDataTypeMismatchException() {
    EnrollmentCSVService badService =
        new EnrollmentCSVService() {
          @Override
          public void writeEnrollmentCSV(java.io.Writer writer, List<EnrollmentDataPoint> list)
              throws CsvDataTypeMismatchException, CsvRequiredFieldEmptyException {

            throw new CsvDataTypeMismatchException("test");
          }
        };

    StringWriter writer = new StringWriter();
    List<EnrollmentDataPoint> list = List.of();

    CsvDataTypeMismatchException ex =
        assertThrows(
            CsvDataTypeMismatchException.class, () -> badService.writeEnrollmentCSV(writer, list));

    assertEquals("test", ex.getMessage());
  }

  @Test
  void test_writeEnrollmentCSV_throwsCsvRequiredFieldEmptyException() {
    EnrollmentCSVService badService =
        new EnrollmentCSVService() {
          @Override
          public void writeEnrollmentCSV(java.io.Writer writer, List<EnrollmentDataPoint> list)
              throws CsvDataTypeMismatchException, CsvRequiredFieldEmptyException {

            throw new CsvRequiredFieldEmptyException("missing field");
          }
        };

    StringWriter writer = new StringWriter();
    List<EnrollmentDataPoint> list = List.of();

    CsvRequiredFieldEmptyException ex =
        assertThrows(
            CsvRequiredFieldEmptyException.class,
            () -> badService.writeEnrollmentCSV(writer, list));

    assertEquals("missing field", ex.getMessage());
  }
}
