package edu.ucsb.cs156.courses.documents;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.Test;

public class CoursePageTests {

  @Test
  public void convertsCoursePageToObject() {
    CoursePage cp = CoursePage.fromJSON(CoursePageFixtures.COURSE_PAGE_JSON);
    assertEquals(1, cp.getPageNumber());
    assertEquals(10, cp.getPageSize());
    assertEquals(49, cp.getTotal());
  }

  @Test
  public void convertsMath3BCoursePageToObject() throws JsonProcessingException {
    CoursePage cp = CoursePage.fromJSON(CoursePageFixtures.COURSE_PAGE_JSON_MATH3B);
    assertEquals(1, cp.getPageNumber());
    assertEquals(10, cp.getPageSize());
    assertEquals(1, cp.getTotal());

    List<ConvertedSection> cs = cp.convertedSections();

    ObjectMapper objectMapper = new ObjectMapper();
    String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(cs);
  }

  @Test
  public void convertedSectionsConvertsProperly() throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper();

    CoursePage cp = CoursePage.fromJSON(CoursePageFixtures.COURSE_PAGE_JSON_MATH3B);
    List<ConvertedSection> convertedSections = cp.convertedSections();

    List<ConvertedSection> expected =
        objectMapper.readValue(
            CoursePageFixtures.CONVERTED_SECTIONS_JSON_MATH5B,
            new TypeReference<List<ConvertedSection>>() {});

    assertEquals(expected, convertedSections);
  }

  @Test
  public void throwsExceptionOnBadJSON() throws Exception {
    CoursePage cp = CoursePage.fromJSON("this is not valid JSON");
    assertNull(cp);
  }
}
