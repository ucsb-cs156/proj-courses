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
import edu.ucsb.cs156.courses.documents.TimeLocation;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = CourseOverTimeBuildingController.class)
@Import(SecurityConfig.class)
@AutoConfigureDataJpa
public class CourseOverTimeBuildingControllerTests {
  private ObjectMapper mapper = new ObjectMapper();

  @Autowired private MockMvc mockMvc;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @Test
  public void test_search_emptyRequest() throws Exception {
    List<ConvertedSection> expectedResult = new ArrayList<ConvertedSection>();
    String urlTemplate =
        "/api/public/courseovertime/buildingsearch/classrooms?quarter=%s&buildingCode=%s";

    String url = String.format(urlTemplate, "20222", "Storke Tower");

    // mock
    when(convertedSectionCollection.findByQuarterAndBuildingCode(
            any(String.class), any(String.class)))
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
            .quarter("20233")
            .courseId("CMPSC   156 -1")
            .title("ADV APP PROGRAM")
            .description(
                "Advanced application programming using a high-level, virtual-machine-based language. Topics include generic programming, exception handling, automatic memory management, and application development, management, and maintenanc e tools, third-party library use, version control, software testing, issue tracking, code review, and working with legacy code.")
            .build();

    TimeLocation loc = TimeLocation.builder().building("SH").room("1431").build();

    Section section = Section.builder().timeLocations(List.of(loc)).build();

    ConvertedSection cs = ConvertedSection.builder().courseInfo(info).section(section).build();

    String urlTemplate =
        "/api/public/courseovertime/buildingsearch/classrooms?quarter=%s&buildingCode=%s";

    String url = String.format(urlTemplate, "20233", "SH");

    // mock
    when(convertedSectionCollection.findByQuarterAndBuildingCode(any(String.class), eq("SH")))
        .thenReturn(List.of(cs));

    // act
    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    // assert
    String expectedString = mapper.writeValueAsString(List.of("1431"));
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_search_sectionIsNull() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20233")
            .courseId("CMPSC   156 -1")
            .title("ADV APP PROGRAM")
            .description(
                "Advanced application programming using a high-level, virtual-machine-based language. Topics include generic programming, exception handling, automatic memory management, and application development, management, and maintenanc e tools, third-party library use, version control, software testing, issue tracking, code review, and working with legacy code.")
            .build();

    ConvertedSection cs =
        ConvertedSection.builder()
            .courseInfo(info)
            .section(null) // missing section
            .build();

    String url =
        "/api/public/courseovertime/buildingsearch/classrooms?quarter=20233&buildingCode=SH";

    when(convertedSectionCollection.findByQuarterAndBuildingCode(any(), eq("SH")))
        .thenReturn(List.of(cs));

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    String expectedString = mapper.writeValueAsString(List.of());
    String responseString = response.getResponse().getContentAsString();

    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_search_timeLocationsIsNull() throws Exception {
    Section section = Section.builder().timeLocations(null).build();
    ConvertedSection cs = ConvertedSection.builder().section(section).build();

    when(convertedSectionCollection.findByQuarterAndBuildingCode(any(), eq("SH")))
        .thenReturn(List.of(cs));

    String url =
        "/api/public/courseovertime/buildingsearch/classrooms?quarter=20233&buildingCode=SH";

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();
    assertEquals("[]", response.getResponse().getContentAsString());
  }

  @Test
  public void test_search_buildingDoesNotMatch() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20233")
            .courseId("CMPSC   156 -1")
            .title("ADV APP PROGRAM")
            .description("desc")
            .build();

    TimeLocation loc =
        TimeLocation.builder()
            .building("PHELP") // Not GIRV
            .room("1431")
            .build();

    Section section = Section.builder().timeLocations(List.of(loc)).build();

    ConvertedSection cs = ConvertedSection.builder().courseInfo(info).section(section).build();

    String url =
        "/api/public/courseovertime/buildingsearch/classrooms?quarter=20233&buildingCode=GIRV";

    when(convertedSectionCollection.findByQuarterAndBuildingCode(any(), eq("GIRV")))
        .thenReturn(List.of(cs));

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    String expectedString = mapper.writeValueAsString(List.of());
    String responseString = response.getResponse().getContentAsString();

    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_search_buildingIsNull_skipsLocation() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20233")
            .courseId("CMPSC   156 -1")
            .title("ADV APP PROGRAM")
            .description("desc")
            .build();

    // TimeLocation with null building
    TimeLocation loc = TimeLocation.builder().building(null).room("1431").build();

    Section section = Section.builder().timeLocations(List.of(loc)).build();

    ConvertedSection cs = ConvertedSection.builder().courseInfo(info).section(section).build();

    String url =
        "/api/public/courseovertime/buildingsearch/classrooms?quarter=20233&buildingCode=SH";

    when(convertedSectionCollection.findByQuarterAndBuildingCode(any(), eq("SH")))
        .thenReturn(List.of(cs));

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    String expected = mapper.writeValueAsString(List.of());
    String actual = response.getResponse().getContentAsString();

    assertEquals(expected, actual);
  }

  @Test
  public void test_search_roomNullOrEmpty_skipsRoom() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20233")
            .courseId("CMPSC   156 -1")
            .title("ADV APP PROGRAM")
            .description("desc")
            .build();

    // room is null
    TimeLocation loc1 = TimeLocation.builder().building("SH").room(null).build();

    // room is empty
    TimeLocation loc2 = TimeLocation.builder().building("SH").room("").build();

    Section section = Section.builder().timeLocations(List.of(loc1, loc2)).build();

    ConvertedSection cs = ConvertedSection.builder().courseInfo(info).section(section).build();

    String url =
        "/api/public/courseovertime/buildingsearch/classrooms?quarter=20233&buildingCode=SH";

    when(convertedSectionCollection.findByQuarterAndBuildingCode(any(), eq("SH")))
        .thenReturn(List.of(cs));

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    String expected = mapper.writeValueAsString(List.of());
    String actual = response.getResponse().getContentAsString();

    assertEquals(expected, actual);
  }

  @Test
  public void test_old_endpoint_returns_course_sections() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20254")
            .courseId("CMPSC 156 -1")
            .title("Advanced Programming")
            .description("Desc")
            .build();

    TimeLocation loc1 = TimeLocation.builder().building("SH").room(null).build();

    // room is empty
    TimeLocation loc2 = TimeLocation.builder().building("SH").room("").build();

    Section section = Section.builder().timeLocations(List.of(loc1, loc2)).build();

    ConvertedSection cs = ConvertedSection.builder().courseInfo(info).section(section).build();

    ConvertedSection cs1 = (ConvertedSection) cs.clone();
    cs1.getCourseInfo().setQuarter("20264"); // Change quarter for sorting

    when(convertedSectionCollection.findByQuarterRangeAndBuildingCode("20232", "20254", "GIRV"))
        .thenReturn(List.of(cs, cs1));

    MvcResult response =
        mockMvc
            .perform(
                get("/api/public/courseovertime/buildingsearch")
                    .param("startQtr", "20232")
                    .param("endQtr", "20254")
                    .param("buildingCode", "GIRV"))
            .andExpect(status().isOk())
            .andReturn();

    String expected =
        mapper.writeValueAsString(List.of(cs1, cs)); // should sort by quarter descending
    String actual = response.getResponse().getContentAsString();

    assertEquals(expected, actual);
  }

  @Test
  public void test_buildingsearch_with_classroom_filter() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20232")
            .courseId("CMPSC 156 -1")
            .title("Advanced Programming")
            .description("Desc")
            .build();

    TimeLocation loc1 = TimeLocation.builder().building("GIRV").room("1431").build();
    TimeLocation loc2 = TimeLocation.builder().building("GIRV").room("1004").build();

    Section section1 = Section.builder().timeLocations(List.of(loc1)).build();
    Section section2 = Section.builder().timeLocations(List.of(loc2)).build();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();
    ConvertedSection cs2 = ConvertedSection.builder().courseInfo(info).section(section2).build();

    when(convertedSectionCollection.findByQuarterRangeAndBuildingCode("20232", "20232", "GIRV"))
        .thenReturn(List.of(cs1, cs2));

    MvcResult response =
        mockMvc
            .perform(
                get("/api/public/courseovertime/buildingsearch")
                    .param("startQtr", "20232")
                    .param("endQtr", "20232")
                    .param("buildingCode", "GIRV")
                    .param("classroom", "1431"))
            .andExpect(status().isOk())
            .andReturn();

    String expected = mapper.writeValueAsString(List.of(cs1));
    String actual = response.getResponse().getContentAsString();

    assertEquals(expected, actual);
  }

  @Test
  public void test_buildingsearch_with_classroom_no_match() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20232")
            .courseId("CMPSC 156 -1")
            .title("Advanced Programming")
            .description("Desc")
            .build();

    TimeLocation loc1 = TimeLocation.builder().building("GIRV").room("1431").build();

    Section section1 = Section.builder().timeLocations(List.of(loc1)).build();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();

    when(convertedSectionCollection.findByQuarterRangeAndBuildingCode("20232", "20232", "GIRV"))
        .thenReturn(List.of(cs1));

    MvcResult response =
        mockMvc
            .perform(
                get("/api/public/courseovertime/buildingsearch")
                    .param("startQtr", "20232")
                    .param("endQtr", "20232")
                    .param("buildingCode", "GIRV")
                    .param("classroom", "9999"))
            .andExpect(status().isOk())
            .andReturn();

    String expected = mapper.writeValueAsString(List.of());
    String actual = response.getResponse().getContentAsString();

    assertEquals(expected, actual);
  }

  @Test
  public void test_buildingsearch_with_empty_classroom() throws Exception {
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20232")
            .courseId("CMPSC 156 -1")
            .title("Advanced Programming")
            .description("Desc")
            .build();

    TimeLocation loc1 = TimeLocation.builder().building("GIRV").room("1431").build();
    TimeLocation loc2 = TimeLocation.builder().building("GIRV").room("1004").build();

    Section section1 = Section.builder().timeLocations(List.of(loc1)).build();
    Section section2 = Section.builder().timeLocations(List.of(loc2)).build();

    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();
    ConvertedSection cs2 = ConvertedSection.builder().courseInfo(info).section(section2).build();

    when(convertedSectionCollection.findByQuarterRangeAndBuildingCode("20232", "20232", "GIRV"))
        .thenReturn(List.of(cs1, cs2));

    MvcResult response =
        mockMvc
            .perform(
                get("/api/public/courseovertime/buildingsearch")
                    .param("startQtr", "20232")
                    .param("endQtr", "20232")
                    .param("buildingCode", "GIRV")
                    .param("classroom", ""))
            .andExpect(status().isOk())
            .andReturn();

    String expected = mapper.writeValueAsString(List.of(cs1, cs2));
    String actual = response.getResponse().getContentAsString();

    assertEquals(expected, actual);
  }
}
