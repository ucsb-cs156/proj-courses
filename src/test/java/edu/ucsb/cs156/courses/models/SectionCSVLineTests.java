package edu.ucsb.cs156.courses.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.junit.jupiter.api.Test;

public class SectionCSVLineTests {

  @Test
  public void test_intToStringWithDefault() throws Exception {
    assertEquals("42", SectionCSVLine.intToStringWithDefault(Integer.valueOf(42)));
    assertEquals("0", SectionCSVLine.intToStringWithDefault(null));
  }

  @Test
  public void test_noArgsConstructor_and_getters_setters() {
    // Exercise @NoArgsConstructor and @Data-generated setters/getters
    SectionCSVLine line = new SectionCSVLine();
    line.setQuarter("20211");
    line.setCourseId("CMPSC 8");
    line.setSection("0100");
    line.setInstructor("Mirza");
    line.setEnrolled("50");
    line.setMaxEnroll("60");
    line.setStatus("Open");
    line.setGes("QNT");

    assertEquals("20211", line.getQuarter());
    assertEquals("CMPSC 8", line.getCourseId());
    assertEquals("0100", line.getSection());
    assertEquals("Mirza", line.getInstructor());
    assertEquals("50", line.getEnrolled());
    assertEquals("60", line.getMaxEnroll());
    assertEquals("Open", line.getStatus());
    assertEquals("QNT", line.getGes());
  }

  @Test
  public void test_allArgsConstructor_and_equals_hashCode() {
    SectionCSVLine line1 =
        new SectionCSVLine(
            "20211", "CMPSC 8", "0100", "Mirza", "50", "60", "Open", "QNT");

    SectionCSVLine line2 =
        new SectionCSVLine(
            "20211", "CMPSC 8", "0100", "Mirza", "50", "60", "Open", "QNT");

    SectionCSVLine different =
        new SectionCSVLine(
            "20211", "CMPSC 16", "0200", "Other", "40", "80", "Closed", "ES");

    assertEquals(line1, line2);
    assertEquals(line1.hashCode(), line2.hashCode());
    assertNotEquals(line1, different);
  }
}
