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
  }

  @Test
  public void convertedSectionsConvertsProperly() throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper();

    CoursePage cp = CoursePage.fromJSON(CoursePageFixtures.COURSE_PAGE_JSON_MATH3B);
    List<ConvertedSection> convertedSections = cp.convertedSections();

    List<ConvertedSection> expected =
        objectMapper.readValue(
            CoursePageFixtures.CONVERTED_SECTIONS_JSON_MATH3B,
            new TypeReference<List<ConvertedSection>>() {});

    assertEquals(expected, convertedSections);
  }

  @Test
  public void throwsExceptionOnBadJSON() throws Exception {
    CoursePage cp = CoursePage.fromJSON("this is not valid JSON");
    assertNull(cp);
  }

  @Test
  public void nextSectionReturnsNextSection() throws JsonProcessingException {
    CoursePage cp = CoursePage.fromJSON(CoursePageFixtures.COURSE_PAGE_JSON_MATH3B);
    List<Section> sections = cp.getClasses().get(0).getClassSections();
    Section nextSection = CoursePage.nextSection(sections, 0);
    assertEquals("30403", nextSection.getEnrollCode());
    Section lastSection = CoursePage.nextSection(sections, sections.size() - 1);
    assertNull(lastSection); // No next section available
  }

  @Test
  public void test_getPrimaries() throws JsonProcessingException {
    CoursePage cp = CoursePage.fromJSON(CoursePageFixtures.COURSE_PAGE_JSON_MATH3B);
    List<Primary> primaries = cp.getPrimaries();
    assertEquals(2, primaries.size());
  }

  @Test
  public void test_getPrimaries_error_no_sections() throws JsonProcessingException {
    CoursePage cp = CoursePage.fromJSON(CoursePageFixtures.COURSE_PAGE_JSON_ERROR_NO_SECTIONS);
    List<Primary> primaries = cp.getPrimaries();
    assertEquals(0, primaries.size());
  }

  @Test
  public void test_getPrimaries_error_first_section_not_primary() throws JsonProcessingException {
    CoursePage cp =
        CoursePage.fromJSON(CoursePageFixtures.COURSE_PAGE_JSON_ERROR_FIRST_SECTION_NOT_PRIMARY);
    List<Primary> primaries = cp.getPrimaries();
    assertEquals(0, primaries.size());
  }

  @Test
  public void test_getListOfPrimaries() throws JsonProcessingException {
    CoursePage coursePage = CoursePage.fromJSON(CoursePageFixtures.COURSE_PAGE_JSON_MATH3B);
    Course course = coursePage.getClasses().get(0); // Get the first course
    List<Primary> primaries = CoursePage.getListOfPrimaries(course);
    assertEquals(2, primaries.size());
  }

  @Test
  public void test_getListOfPrimaries_FirstSectionNotPrimary() throws JsonProcessingException {
    CoursePage coursePage =
        CoursePage.fromJSON(CoursePageFixtures.COURSE_PAGE_JSON_ERROR_FIRST_SECTION_NOT_PRIMARY);
    Course course = coursePage.getClasses().get(0); // Get the first course
    List<Primary> primaries = CoursePage.getListOfPrimaries(course);
    assertEquals(0, primaries.size());
  }

  @Test
  public void test_getListOfPrimaries_error_no_sections() throws JsonProcessingException {
    Course course = new Course();
    course.setClassSections(List.of()); // empty sections
    List<Primary> primaries = CoursePage.getListOfPrimaries(course);
    assertEquals(0, primaries.size());
  }
}
