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
import edu.ucsb.cs156.courses.repositories.UserRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = CourseOverTimeDescriptionController.class)
@Import(SecurityConfig.class)
public class CourseOverTimeDescriptionControllerTests {
  private ObjectMapper mapper = new ObjectMapper();

  @Autowired private MockMvc mockMvc;

  @MockBean ConvertedSectionCollection convertedSectionCollection;
  @MockitoBean UserRepository userRepository;

  @Test
  public void test_search_emptyRequest() throws Exception {
    List<ConvertedSection> expectedResult = new ArrayList<ConvertedSection>();
    String urlTemplate =
        "/api/public/description/search?startQtr=%s&endQtr=%s&searchTerms=%s&lectureOnly=%s";

    String url = String.format(urlTemplate, "20222", "20244", "computer science", "false");

    when(convertedSectionCollection.findByQuarterRangeAndDescription(
            any(String.class), any(String.class), any(String.class), any(String.class)))
        .thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();

    String responseString = response.getResponse().getContentAsString();
    String expectedString = mapper.writeValueAsString(expectedResult);

    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_search_validRequest_allSections() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC   24 -1")
            .title("OBJ ORIENTED DESIGN")
            .description("Intro to object oriented design")
            .build();

    Section section1 = Section.builder().section("0100").build();
    Section section2 = Section.builder().section("0101").build();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();
    ConvertedSection cs2 = ConvertedSection.builder().courseInfo(info).section(section2).build();

    String urlTemplate =
        "/api/public/description/search?startQtr=%s&endQtr=%s&searchTerms=%s&lectureOnly=%s";

    String url = String.format(urlTemplate, "20222", "20244", "object oriented", "false");

    List<ConvertedSection> expectedSecs = new ArrayList<ConvertedSection>();
    expectedSecs.addAll(Arrays.asList(cs1, cs2));

    when(convertedSectionCollection.findByQuarterRangeAndDescription(
            any(String.class), any(String.class), eq(Pattern.quote("object oriented")), eq("^.*")))
        .thenReturn(expectedSecs);

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    String expectedString = mapper.writeValueAsString(expectedSecs);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_search_validRequest_onlyLectures_and_sorts_by_quarter() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC   24 -1")
            .title("OBJ ORIENTED DESIGN")
            .description("Intro to object oriented design")
            .build();

    Section section1 = Section.builder().section("0100").build();
    Section section2 = Section.builder().section("0200").build();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();

    ConvertedSection cs2 = (ConvertedSection) cs1.clone();
    cs2.setSection(section2);
    cs2.getCourseInfo().setQuarter("20244");

    String urlTemplate =
        "/api/public/description/search?startQtr=%s&endQtr=%s&searchTerms=%s&lectureOnly=%s";

    String url = String.format(urlTemplate, "20222", "20244", "object oriented", "true");

    List<ConvertedSection> expectedSecsOutOfOrder = new ArrayList<ConvertedSection>();
    expectedSecsOutOfOrder.addAll(Arrays.asList(cs1, cs2));

    List<ConvertedSection> expectedSecsInOrder = new ArrayList<ConvertedSection>();
    expectedSecsInOrder.addAll(Arrays.asList(cs2, cs1));

    when(convertedSectionCollection.findByQuarterRangeAndDescription(
            any(String.class),
            any(String.class),
            eq(Pattern.quote("object oriented")),
            eq("^\\d+00$")))
        .thenReturn(expectedSecsOutOfOrder);

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    String expectedString = mapper.writeValueAsString(expectedSecsInOrder);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }
}
