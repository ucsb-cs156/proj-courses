package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CourseInfo;
import edu.ucsb.cs156.courses.documents.Primary;
import edu.ucsb.cs156.courses.documents.Section;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = CourseOverTimeController.class)
public class CourseOverTimeControllerTests extends ControllerTestCase {
  private ObjectMapper mapper = new ObjectMapper();

  @Autowired private MockMvc mockMvc;

  @MockitoBean ConvertedSectionCollection convertedSectionCollection;
  @MockitoBean UserRepository userRepository;

  @Test
  public void test_search_emptyRequest() throws Exception {
    List<ConvertedSection> databaseResult = new ArrayList<ConvertedSection>();
    List<Primary> expectedResult = new ArrayList<Primary>();
    String urlTemplate =
        "/api/public/courseovertime/search?startQtr=%s&endQtr=%s&subjectArea=%s&courseNumber=%s";

    String url = String.format(urlTemplate, "20222", "20212", "CMPSC", "130A");

    // mock
    when(convertedSectionCollection.findByQuarterRangeAndCourseId(
            any(String.class), any(String.class), any(String.class)))
        .thenReturn(databaseResult);

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

    Section section1 = Section.builder().enrollCode("07500").section("0100").build();

    Section section2 = Section.builder().enrollCode("07501").section("0101").build();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();

    ConvertedSection cs2 = ConvertedSection.builder().courseInfo(info).section(section2).build();

    String urlTemplate =
        "/api/public/courseovertime/search?startQtr=%s&endQtr=%s&subjectArea=%s&courseNumber=%s";

    String url = String.format(urlTemplate, "20222", "20222", "CMPSC", "24");

    List<ConvertedSection> databaseResult = new ArrayList<ConvertedSection>();
    databaseResult.addAll(Arrays.asList(cs2, cs1));

    List<Primary> expectedPrimaries =
        Arrays.asList(
            Primary.builder()
                .quarter("20222")
                .courseId("CMPSC   24 -1")
                .title("OBJ ORIENTED DESIGN")
                .description("Intro to object oriented design")
                .primary(section1)
                .subRows(Arrays.asList(section2))
                .build());

    // mock
    when(convertedSectionCollection.findByQuarterRangeAndCourseId(
            any(String.class), any(String.class), eq("CMPSC    24")))
        .thenReturn(databaseResult);

    // act
    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    // assert
    String expectedString = mapper.writeValueAsString(expectedPrimaries);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_search_validRequestWithSuffix() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC   130A -1")
            .title("DATA STRUCT AND ALG")
            .description("Data Structures and Algorithms")
            .build();

    Section section1 = Section.builder().enrollCode("07500").section("0100").build();

    Section section2 = Section.builder().enrollCode("07555").section("0100").build();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();

    ConvertedSection cs2 = (ConvertedSection) cs1.clone();
    cs2.setSection(section2);
    cs2.getCourseInfo().setQuarter("20244");

    String urlTemplate =
        "/api/public/courseovertime/search?startQtr=%s&endQtr=%s&subjectArea=%s&courseNumber=%s";

    String url = String.format(urlTemplate, "20222", "20222", "CMPSC", "130A");

    List<ConvertedSection> databaseResultOutOfOrder = new ArrayList<ConvertedSection>();
    databaseResultOutOfOrder.addAll(Arrays.asList(cs1, cs2));

    // results should be sorted by quarter, descending (cs2 is 20244, cs1 is 20222)
    List<Primary> expectedPrimariesInOrder =
        Arrays.asList(
            Primary.builder()
                .quarter("20244")
                .courseId("CMPSC   130A -1")
                .title("DATA STRUCT AND ALG")
                .description("Data Structures and Algorithms")
                .primary(section2)
                .subRows(new ArrayList<>())
                .build(),
            Primary.builder()
                .quarter("20222")
                .courseId("CMPSC   130A -1")
                .title("DATA STRUCT AND ALG")
                .description("Data Structures and Algorithms")
                .primary(section1)
                .subRows(new ArrayList<>())
                .build());

    // mock
    when(convertedSectionCollection.findByQuarterRangeAndCourseId(
            any(String.class), any(String.class), eq("CMPSC   130A ")))
        .thenReturn(databaseResultOutOfOrder);

    // act
    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    // assert
    String expectedString = mapper.writeValueAsString(expectedPrimariesInOrder);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }
}
