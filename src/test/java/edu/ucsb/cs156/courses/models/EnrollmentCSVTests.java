package edu.ucsb.cs156.courses.models;

import static org.junit.jupiter.api.Assertions.*;

import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

public class EnrollmentCSVTests {

  @Test
  void testLombokGeneratedMethods() {
    EnrollmentCSV csv = new EnrollmentCSV();

    // touches getters/setters, toString, equals, hashCode
    csv.setId(1L);
    csv.setYyyyq("20241");
    csv.setEnrollCd("0123");
    csv.setCourseId("CMPSC 156");
    csv.setSection("0100");
    csv.setEnrollment(55);
    csv.setDateCreated(LocalDateTime.now());

    assertEquals(1L, csv.getId());
    assertEquals("20241", csv.getYyyyq());
    assertEquals("0123", csv.getEnrollCd());
    assertEquals("CMPSC 156", csv.getCourseId());
    assertEquals("0100", csv.getSection());
    assertEquals(55, csv.getEnrollment());
    assertNotNull(csv.getDateCreated());

    // ensure lombok methods execute (Jacoco)
    csv.toString();
    csv.hashCode();
    csv.equals(new EnrollmentCSV());
  }

  @Test
  void testFromEntity() {
    LocalDateTime now = LocalDateTime.now();
    EnrollmentDataPoint edp = new EnrollmentDataPoint();
    edp.setId(9L);
    edp.setYyyyq("20244");
    edp.setEnrollCd("9999");
    edp.setCourseId("CMPSC 130A");
    edp.setSection("0200");
    edp.setEnrollment(120);
    edp.setDateCreated(now);

    EnrollmentCSV csv = EnrollmentCSV.fromEntity(edp);

    assertEquals(9L, csv.getId());
    assertEquals("20244", csv.getYyyyq());
    assertEquals("9999", csv.getEnrollCd());
    assertEquals("CMPSC 130A", csv.getCourseId());
    assertEquals("0200", csv.getSection());
    assertEquals(120, csv.getEnrollment());
    assertEquals(now, csv.getDateCreated());
  }
}
