package edu.ucsb.cs156.courses.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class SectionCSVLineTests {

  @Test
  public void test_intToStringWithDefault() throws Exception {
    assertEquals("42", SectionCSVLine.intToStringWithDefault(Integer.valueOf(42)));
    assertEquals("0", SectionCSVLine.intToStringWithDefault(null));
  }

  @Test
  void test_no_args_constructor_setters_and_equals() {
    // Use no-args + setters
    SectionCSVLine line = new SectionCSVLine();
    line.setQuarter("20251");
    line.setCourseId("CMPSC 156");
    line.setSection("0101");
    line.setInstructor("Conrad");
    line.setEnrolled("50");
    line.setMaxEnroll("80");
    line.setStatus("Open");
    line.setGes("None");

    // Use getters to confirm
    assertEquals("20251", line.getQuarter());
    assertEquals("CMPSC 156", line.getCourseId());
    assertEquals("0101", line.getSection());

    // Force coverage for equals/hashCode + all-args constructor
    SectionCSVLine same =
        new SectionCSVLine("20251", "CMPSC 156", "0101", "Conrad", "50", "80", "Open", "None");

    assertEquals(line, same);
    assertEquals(line.hashCode(), same.hashCode());

    // Cover toString
    assertTrue(line.toString().contains("CMPSC 156"));
  }
}
