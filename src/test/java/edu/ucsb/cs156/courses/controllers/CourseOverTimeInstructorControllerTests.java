package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CourseInfo;
import edu.ucsb.cs156.courses.documents.Section;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = CourseOverTimeInstructorController.class)
@Import(SecurityConfig.class)
@AutoConfigureDataJpa
public class CourseOverTimeInstructorControllerTests {
  private final Logger logger =
      LoggerFactory.getLogger(CourseOverTimeInstructorControllerTests.class);
  private ObjectMapper mapper = new ObjectMapper();

  @Autowired private MockMvc mockMvc;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @Test
  public void test_search_emptyRequest() throws Exception {
    List<ConvertedSection> expectedResult = new ArrayList<ConvertedSection>();
    String urlTemplate =
        "/api/public/courseovertime/instructorsearch?startQtr=%s&endQtr=%s&instructor=%s&lectureOnly=%s";

    String url = String.format(urlTemplate, "20222", "20212", "CONRAD P T", "false");

    // mock
    when(convertedSectionCollection.findByQuarterRangeAndInstructor(
            any(String.class), any(String.class), any(String.class), any(String.class)))
        .thenReturn(expectedResult);

    // act
    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    String expectedString = mapper.writeValueAsString(expectedResult);

    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_search_validRequestWithoutSuffix() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC   24 -1")
            .title("OBJ ORIENTED DESIGN")
            .description("Intro to object oriented design")
            .build();

    Section section1 = new Section();

    Section section2 = new Section();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();

    ConvertedSection cs2 = ConvertedSection.builder().courseInfo(info).section(section2).build();

    String urlTemplate =
        "/api/public/courseovertime/instructorsearch?startQtr=%s&endQtr=%s&instructor=%s&lectureOnly=%s";

    String url = String.format(urlTemplate, "20222", "20222", "CONRAD P T", "false");

    List<ConvertedSection> expectedSecs = new ArrayList<ConvertedSection>();
    expectedSecs.addAll(Arrays.asList(cs1, cs2));

    // mock
    when(convertedSectionCollection.findByQuarterRangeAndInstructor(
            any(String.class), any(String.class), eq("^CONRAD P T"), eq("^.*")))
        .thenReturn(expectedSecs);

    // act
    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    // assert
    String expectedString = mapper.writeValueAsString(expectedSecs);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_search_validRequestOnlyLectures() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC   24 -1")
            .title("OBJ ORIENTED DESIGN")
            .description("Intro to object oriented design")
            .build();

    Section section1 = new Section();

    Section section2 = new Section();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();

    ConvertedSection cs2 = ConvertedSection.builder().courseInfo(info).section(section2).build();

    String urlTemplate =
        "/api/public/courseovertime/instructorsearch?startQtr=%s&endQtr=%s&instructor=%s&lectureOnly=%s";

    String url = String.format(urlTemplate, "20222", "20222", "CONRAD P T", "true");

    List<ConvertedSection> expectedSecs = new ArrayList<ConvertedSection>();
    expectedSecs.addAll(Arrays.asList(cs1, cs2));

    // mock
    when(convertedSectionCollection.findByQuarterRangeAndInstructor(
            any(String.class),
            any(String.class),
            eq("^CONRAD P T"),
            eq("^(Teaching and in charge)")))
        .thenReturn(expectedSecs);

    // act
    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    // assert
    String expectedString = mapper.writeValueAsString(expectedSecs);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }
}
