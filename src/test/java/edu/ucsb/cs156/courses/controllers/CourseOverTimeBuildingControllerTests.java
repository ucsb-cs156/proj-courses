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
import java.util.Arrays;
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
        "/api/public/courseovertime/buildingsearch?startQtr=%s&endQtr=%s&buildingCode=%s";

    String url = String.format(urlTemplate, "20221", "20222", "Storke Tower");

    // mock
    when(convertedSectionCollection.findByQuarterRangeAndBuildingCode(
            any(String.class), any(String.class), any(String.class)))
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
        "/api/public/courseovertime/buildingsearch?startQtr=%s&endQtr=%s&buildingCode=%s";

    String url = String.format(urlTemplate, "20221", "20222", "GIRV");

    List<ConvertedSection> expectedSecs = new ArrayList<ConvertedSection>();
    expectedSecs.addAll(Arrays.asList(cs1, cs2));

    // mock
    when(convertedSectionCollection.findByQuarterRangeAndBuildingCode(
            any(String.class), any(String.class), eq("GIRV")))
        .thenReturn(expectedSecs);

    // act
    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    // assert
    String expectedString = mapper.writeValueAsString(expectedSecs);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_classrooms_emptyRequest() throws Exception {
    // no sections → expect empty room list
    List<ConvertedSection> emptySecs = new ArrayList<>();
    String urlTemplate =
        "/api/public/courseovertime/classrooms?startQtr=%s&endQtr=%s&buildingCode=%s";
    String url = String.format(urlTemplate, "20221", "20222", "GIRV");

    // mock
    when(convertedSectionCollection.findByQuarterRangeAndBuildingCode(
            any(String.class), any(String.class), any(String.class)))
        .thenReturn(emptySecs);

    // act
    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    String expectedString = mapper.writeValueAsString(new ArrayList<String>());
    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_classrooms_validRequest() throws Exception {
    // build one ConvertedSection with two TimeLocations in GIRV
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC   24 -1")
            .title("OBJ ORIENTED DESIGN")
            .description("Intro to object oriented design")
            .build();

    TimeLocation tl1 = new TimeLocation();
    tl1.setBuilding("GIRV");
    tl1.setRoom("1004");

    TimeLocation tl2 = new TimeLocation();
    tl2.setBuilding("GIRV");
    tl2.setRoom("2110");

    TimeLocation drop = new TimeLocation();
    drop.setBuilding("ELSB"); // different building
    drop.setRoom("2002");

    Section section = new Section();
    section.setTimeLocations(Arrays.asList(tl1, tl2, drop));

    ConvertedSection cs = ConvertedSection.builder().courseInfo(info).section(section).build();

    List<ConvertedSection> repoResult = Arrays.asList(cs);
    String urlTemplate =
        "/api/public/courseovertime/classrooms?startQtr=%s&endQtr=%s&buildingCode=%s";
    String url = String.format(urlTemplate, "20221", "20222", "GIRV");

    // mock
    when(convertedSectionCollection.findByQuarterRangeAndBuildingCode(
            any(String.class), any(String.class), eq("GIRV")))
        .thenReturn(repoResult);

    // act
    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    List<String> expectedRooms = Arrays.asList("1004", "2110");
    String expectedString = mapper.writeValueAsString(expectedRooms);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }
}
