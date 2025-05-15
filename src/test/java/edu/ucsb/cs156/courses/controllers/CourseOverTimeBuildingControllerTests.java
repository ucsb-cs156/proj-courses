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
        "/api/public/courseovertime/buildingsearch/classroom?quarter=%s&buildingCode=%s";

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
            .description("Advanced application programming using a high-level, virtual-machine-based language. Topics include generic programming, exception handling, automatic memory management, and application development, management, and maintenanc e tools, third-party library use, version control, software testing, issue tracking, code review, and working with legacy code.")
            .build();

    TimeLocation loc = 
      TimeLocation.builder()
            .building("SH")
            .room("1431")
            .build();

    Section section = 
      Section.builder()
          .timeLocations(List.of(loc))
          .build();

    ConvertedSection cs = 
      ConvertedSection.builder()
          .courseInfo(info)
          .section(section) 
          .build();

    String urlTemplate =
        "/api/public/courseovertime/buildingsearch/classroom?quarter=%s&buildingCode=%s";

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
}
