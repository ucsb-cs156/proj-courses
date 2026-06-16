package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.config.RateLimitConfig;
import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CourseInfo;
import edu.ucsb.cs156.courses.documents.Section;
import edu.ucsb.cs156.courses.filters.RateLimitFilter;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = CourseOverTimeDescriptionController.class)
@Import({SecurityConfig.class, RateLimitConfig.class})
public class CourseOverTimeDescriptionControllerTests {
  private ObjectMapper mapper = new ObjectMapper();

  @Autowired private MockMvc mockMvc;
  @Autowired private RateLimitFilter rateLimitFilter;

  @MockitoBean ConvertedSectionCollection convertedSectionCollection;
  @MockitoBean UserRepository userRepository;

  @Test
  public void test_search_emptyRequest() throws Exception {
    List<ConvertedSection> expectedResult = new ArrayList<ConvertedSection>();
    String urlTemplate =
        "/api/public/description/search?startQtr=%s&endQtr=%s&searchTerms=%s&lectureOnly=%s";

    String url = String.format(urlTemplate, "20222", "20212", "data", "false");

    when(convertedSectionCollection.findByQuarterRangeAndSearchTerms(
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
  public void test_search_validRequest() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC   24 -1")
            .title("OBJ ORIENTED DESIGN")
            .description("Intro to object oriented design and data science")
            .build();

    Section section1 = new Section();
    Section section2 = new Section();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();
    ConvertedSection cs2 = ConvertedSection.builder().courseInfo(info).section(section2).build();

    String urlTemplate =
        "/api/public/description/search?startQtr=%s&endQtr=%s&searchTerms=%s&lectureOnly=%s";

    String url = String.format(urlTemplate, "20222", "20222", "data", "false");

    List<ConvertedSection> expectedSecs = new ArrayList<ConvertedSection>();
    expectedSecs.addAll(Arrays.asList(cs1, cs2));

    when(convertedSectionCollection.findByQuarterRangeAndSearchTerms(
            any(String.class), any(String.class), eq(Pattern.quote("data")), eq(".*")))
        .thenReturn(expectedSecs);

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    String expectedString = mapper.writeValueAsString(expectedSecs);
    String responseString = response.getResponse().getContentAsString();

    assertEquals(expectedString, responseString);

    verify(convertedSectionCollection)
        .findByQuarterRangeAndSearchTerms("20222", "20222", Pattern.quote("data"), ".*");
  }

  @Test
  public void test_search_validRequestOnlyLectures() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC   24 -1")
            .title("OBJ ORIENTED DESIGN")
            .description("Intro to object oriented design and data science")
            .build();

    Section section1 = new Section();
    Section section2 = new Section();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();

    ConvertedSection cs2 = (ConvertedSection) cs1.clone();
    cs2.setSection(section2);
    cs2.getCourseInfo().setQuarter("20244");

    String urlTemplate =
        "/api/public/description/search?startQtr=%s&endQtr=%s&searchTerms=%s&lectureOnly=%s";

    String url = String.format(urlTemplate, "20222", "20244", "data", "true");

    List<ConvertedSection> expectedSecsOutOfOrder = new ArrayList<ConvertedSection>();
    expectedSecsOutOfOrder.addAll(Arrays.asList(cs1, cs2));

    List<ConvertedSection> expectedSecsInOrder = new ArrayList<ConvertedSection>();
    expectedSecsInOrder.addAll(Arrays.asList(cs2, cs1));

    when(convertedSectionCollection.findByQuarterRangeAndSearchTerms(
            any(String.class), any(String.class), eq(Pattern.quote("data")), eq(".*00$")))
        .thenReturn(expectedSecsOutOfOrder);

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    String expectedString = mapper.writeValueAsString(expectedSecsInOrder);
    String responseString = response.getResponse().getContentAsString();

    assertEquals(expectedString, responseString);

    verify(convertedSectionCollection)
        .findByQuarterRangeAndSearchTerms(
            any(String.class), any(String.class), any(String.class), any(String.class));
  }

  @Test
  public void test_search_escapesRegexSpecialCharacters() throws Exception {
    List<ConvertedSection> expectedResult = new ArrayList<>();

    when(convertedSectionCollection.findByQuarterRangeAndSearchTerms(
            eq("20222"), eq("20222"), eq(Pattern.quote("[")), eq(".*")))
        .thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(
                get("/api/public/description/search")
                    .param("startQtr", "20222")
                    .param("endQtr", "20222")
                    .param("searchTerms", "[")
                    .param("lectureOnly", "false"))
            .andExpect(status().isOk())
            .andReturn();

    String responseString = response.getResponse().getContentAsString();
    String expectedString = mapper.writeValueAsString(expectedResult);

    assertEquals(expectedString, responseString);
    verify(convertedSectionCollection)
        .findByQuarterRangeAndSearchTerms("20222", "20222", Pattern.quote("["), ".*");
  }
}
