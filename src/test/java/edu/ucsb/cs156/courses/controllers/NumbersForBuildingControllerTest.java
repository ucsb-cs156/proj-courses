package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.Section;
import edu.ucsb.cs156.courses.documents.TimeLocation;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = NumbersForBuildingController.class)
@Import(SecurityConfig.class)
@AutoConfigureDataJpa
public class NumbersForBuildingControllerTest {

  private ObjectMapper mapper = new ObjectMapper();

  @Autowired private MockMvc mockMvc;

  @MockBean private ConvertedSectionCollection convertedSectionCollection;

  @Test
  public void test_getRoomNumbers_emptyRequest() throws Exception {
    List<ConvertedSection> expectedResult = new ArrayList<>();
    String urlTemplate = "/api/public/classrooms/roomnumbers?quarter=%s&buildingCode=%s";
    String url = String.format(urlTemplate, "20222", "GIRV");

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
    String expectedString = mapper.writeValueAsString(new HashSet<>());

    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_getRoomNumbers_validRequest() throws Exception {
    TimeLocation timeLocation1 = TimeLocation.builder().building("GIRV").room("1116").build();
    TimeLocation timeLocation2 = TimeLocation.builder().building("GIRV").room("2120").build();
    TimeLocation timeLocation3 = TimeLocation.builder().building("PHELP").room("3525").build();

    Section section1 = Section.builder().timeLocations(Arrays.asList(timeLocation1)).build();
    Section section2 = Section.builder().timeLocations(Arrays.asList(timeLocation2)).build();
    Section section3 = Section.builder().timeLocations(Arrays.asList(timeLocation3)).build();

    ConvertedSection cs1 = ConvertedSection.builder().section(section1).build();
    ConvertedSection cs2 = ConvertedSection.builder().section(section2).build();
    ConvertedSection cs3 = ConvertedSection.builder().section(section3).build();

    String urlTemplate = "/api/public/classrooms/roomnumbers?quarter=%s&buildingCode=%s";
    String url = String.format(urlTemplate, "20221", "GIRV");

    List<ConvertedSection> sections = Arrays.asList(cs1, cs2, cs3);

    when(convertedSectionCollection.findByQuarterRangeAndBuildingCode(
            any(String.class), any(String.class), eq("GIRV")))
        .thenReturn(sections);

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    Set<String> expectedRoomNumbers = new HashSet<>(Arrays.asList("1116", "2120"));
    String expectedString = mapper.writeValueAsString(expectedRoomNumbers);
    String responseString = response.getResponse().getContentAsString();

    assertEquals(expectedString, responseString);
  }
}
