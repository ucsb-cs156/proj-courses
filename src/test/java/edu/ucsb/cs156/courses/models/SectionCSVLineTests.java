package edu.ucsb.cs156.courses.models;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class SectionCSVLineTests {

  @Test
  public void test_intToStringWithDefault() throws Exception {
    assertEquals("42", SectionCSVLine.intToStringWithDefault(Integer.valueOf(42)));
    assertEquals("0", SectionCSVLine.intToStringWithDefault(null));
  }
}
