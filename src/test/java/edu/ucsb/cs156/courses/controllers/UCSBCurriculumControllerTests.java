package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.documents.CoursePage;
import edu.ucsb.cs156.courses.documents.CoursePageFixtures;
import edu.ucsb.cs156.courses.documents.Primary;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = UCSBCurriculumController.class)
public class UCSBCurriculumControllerTests extends ControllerTestCase {

  @MockBean UserRepository userRepository;

  @Autowired private MockMvc mockMvc;

  @MockBean private UCSBCurriculumService ucsbCurriculumService;

  @Test
  public void test_search() throws Exception {

    String expectedResult = "{expectedJSONResult}";
    String urlTemplate = "/api/public/basicsearch?qtr=%s&dept=%s&level=%s";
    String url = String.format(urlTemplate, "20204", "CMPSC", "L");
    when(ucsbCurriculumService.getJSON(any(String.class), any(String.class), any(String.class)))
        .thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();
    String responseString = response.getResponse().getContentAsString();

    assertEquals(expectedResult, responseString);
  }

  // Tests for the final exam information controller
  @Test
  public void test_finalsInfo() throws Exception {
    String expectedResult = "{expectedJSONResult}";
    String urlTemplate = "/api/public/finalsInfo?quarterYYYYQ=%s&enrollCd=%s";
    String url = String.format(urlTemplate, "20251", "67421");
    when(ucsbCurriculumService.getFinalsInfo(any(String.class), any(String.class)))
        .thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();
    String responseString = response.getResponse().getContentAsString();

    assertEquals(expectedResult, responseString);
  }

  /** GET /api/public/generalEducationInfo → raw JSON from service */
  @Test
  public void test_generalEducationInfo_noCollegeCode() throws Exception {
    // ← use the real “English Reading & Composition” (all ASCII) instead of “…”
    String expectedJson =
        "["
            + "{\"requirementCode\":\"A1\","
            + "\"requirementTranslation\":\"English Reading & Composition\","
            + "\"collegeCode\":\"ENGR\","
            + "\"objCode\":\"BS\","
            + "\"courseCount\":1,"
            + "\"units\":4,"
            + "\"inactive\":false}"
            + "]";

    when(ucsbCurriculumService.getGeneralEducationInfo()).thenReturn(expectedJson);

    mockMvc
        .perform(get("/api/public/generalEducationInfo").contentType("application/json"))
        .andExpect(status().isOk())
        .andExpect(content().json(expectedJson));
  }

  /** GET /api/public/generalEducationInfo?collegeCode=ENGR → List<String> of codes */
  @Test
  public void test_generalEducationInfo_withCollegeCode() throws Exception {
    // our controller will call getRequirementCodesByCollege("ENGR")
    List<String> fakeCodes = List.of("A1", "A2");
    when(ucsbCurriculumService.getRequirementCodesByCollege("ENGR")).thenReturn(fakeCodes);

    MvcResult response =
        mockMvc
            .perform(
                get("/api/public/generalEducationInfo")
                    .param("collegeCode", "ENGR")
                    .contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();

    String body = response.getResponse().getContentAsString();
    // JSON representation of ["A1","A2"]
    assertEquals("[\"A1\",\"A2\"]", body);
  }

  @Test
  public void test_getPrimaries() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper();
    String subjectArea = "MATH";
    String quarter = "20222";
    String level = "L";
    String expectedCoursePageJSON = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage expectedCoursePage =
        objectMapper.readValue(expectedCoursePageJSON, CoursePage.class);
    List<Primary> expectedConvertedPrimaries = expectedCoursePage.getPrimaries();

    when(ucsbCurriculumService.getPrimaries(subjectArea, quarter, level))
        .thenReturn(expectedConvertedPrimaries);
    MvcResult response =
        mockMvc
            .perform(
                get("/api/public/primaries")
                    .param("dept", subjectArea)
                    .param("qtr", quarter)
                    .param("level", level)
                    .contentType("application/json"))
            .andExpect(status().isOk())
            .andExpect(content().json(objectMapper.writeValueAsString(expectedConvertedPrimaries)))
            .andReturn();

    String body = response.getResponse().getContentAsString();
    assertEquals(objectMapper.writeValueAsString(expectedConvertedPrimaries), body);
  }

  @Test
  public void test_getPrimariesGE() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper();
    String quarter = "20251";
    String area = "A1";
    // fixture classes don't technically match input GE area/quarter,
    // but that relies on underlying UCSB API, so no need to test in this controller
    String expectedCoursePageJSON = CoursePageFixtures.COURSE_PAGE_JSON;
    CoursePage expectedCoursePage =
        objectMapper.readValue(expectedCoursePageJSON, CoursePage.class);
    List<Primary> allPrimaries = expectedCoursePage.getPrimaries();

    // Compute the deduplicated list the same way the controller does
    Set<String> seen = new HashSet<>();
    List<Primary> expectedDeduped = new ArrayList<>();
    for (Primary p : allPrimaries) {
      if (seen.add(p.getCourseId())) {
        expectedDeduped.add(p);
      }
    }

    when(ucsbCurriculumService.getPrimariesByGE(quarter, area)).thenReturn(allPrimaries);
    MvcResult response =
        mockMvc
            .perform(
                get("/api/public/primariesge")
                    .param("qtr", quarter)
                    .param("area", area)
                    .contentType("application/json"))
            .andExpect(status().isOk())
            .andExpect(content().json(objectMapper.writeValueAsString(expectedDeduped)))
            .andReturn();

    String body = response.getResponse().getContentAsString();
    assertEquals(objectMapper.writeValueAsString(expectedDeduped), body);
  }

  @Test
  public void test_getPrimariesGE_all_deduplicates() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper();
    String quarter = "20251";

    Primary courseA = Primary.builder().courseId("CMPSC 16").title("Intro to CS").build();
    Primary courseB = Primary.builder().courseId("MATH 3A").title("Calculus 1").build();
    Primary courseDup = Primary.builder().courseId("CMPSC 16").title("Intro to CS").build();

    when(ucsbCurriculumService.getAllRequirementCodes()).thenReturn(Arrays.asList("A1", "B"));
    when(ucsbCurriculumService.getPrimariesByGE(quarter, "A1"))
        .thenReturn(Arrays.asList(courseA, courseB));
    when(ucsbCurriculumService.getPrimariesByGE(quarter, "B")).thenReturn(Arrays.asList(courseDup));

    List<Primary> expectedCombined = Arrays.asList(courseA, courseB);

    MvcResult response =
        mockMvc
            .perform(
                get("/api/public/primariesge")
                    .param("qtr", quarter)
                    .param("area", "ALL")
                    .contentType("application/json"))
            .andExpect(status().isOk())
            .andExpect(content().json(objectMapper.writeValueAsString(expectedCombined)))
            .andReturn();

    String body = response.getResponse().getContentAsString();
    assertEquals(objectMapper.writeValueAsString(expectedCombined), body);
  }
}
