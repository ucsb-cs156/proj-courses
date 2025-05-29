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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = GeneralEducationFullController.class)
@Import(SecurityConfig.class)
@AutoConfigureDataJpa
public class GeneralEducationFullControllerTest {

  private ObjectMapper mapper = new ObjectMapper();

  @Autowired private MockMvc mockMvc;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @Test
  public void test_search_emptyResult() throws Exception {
    List<ConvertedSection> expectedResult = new ArrayList<ConvertedSection>();
    String urlTemplate = "/api/public/generalEducation/gesearch?startQtr=%s&endQtr=%s&geCode=%s";
    String url = String.format(urlTemplate, "20221", "20222", "A1");

    // Mock the repository call
    when(convertedSectionCollection.findByQuarterRangeAndGECode(
            any(String.class), any(String.class), any(String.class)))
        .thenReturn(expectedResult);

    // Perform the request
    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();

    // Assert the response
    String responseString = response.getResponse().getContentAsString();
    String expectedString = mapper.writeValueAsString(expectedResult);
    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_search_validResult() throws Exception {
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

    List<ConvertedSection> expectedResult = Arrays.asList(cs1, cs2);

    String urlTemplate = "/api/public/generalEducation/gesearch?startQtr=%s&endQtr=%s&geCode=%s";
    String url = String.format(urlTemplate, "20221", "20222", "A1");

    // Mock the repository call
    when(convertedSectionCollection.findByQuarterRangeAndGECode(eq("20221"), eq("20222"), eq("A1")))
        .thenReturn(expectedResult);

    // Perform the request
    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();

    // Assert the response
    String responseString = response.getResponse().getContentAsString();
    String expectedString = mapper.writeValueAsString(expectedResult);
    assertEquals(expectedString, responseString);
  }
}
