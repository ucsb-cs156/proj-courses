package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import java.util.List;


@WebMvcTest(value = UCSBCurriculumController.class)
@Import(SecurityConfig.class)
@AutoConfigureDataJpa
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

  /**
   * GET /api/public/generalEducationInfo  → raw JSON from service
   */
  @Test
  public void test_generalEducationInfo_noCollegeCode() throws Exception {
    // ← use the real “English Reading & Composition” (all ASCII) instead of “…”
    String expectedJson =
      "[" +
        "{\"requirementCode\":\"A1\"," +
        "\"requirementTranslation\":\"English Reading & Composition\"," +
        "\"collegeCode\":\"ENGR\"," +
        "\"objCode\":\"BS\"," +
        "\"courseCount\":1," +
        "\"units\":4," +
        "\"inactive\":false}" +
      "]";

    when(ucsbCurriculumService.getGeneralEducationInfo())
        .thenReturn(expectedJson);

    mockMvc.perform(get("/api/public/generalEducationInfo")
              .contentType("application/json"))
          .andExpect(status().isOk())
          .andExpect(content().json(expectedJson));
  }

  /**
   * GET /api/public/generalEducationInfo?collegeCode=ENGR  → List<String> of codes
   */
  @Test
  public void test_generalEducationInfo_withCollegeCode() throws Exception {
    // our controller will call getRequirementCodesByCollege("ENGR")
    List<String> fakeCodes = List.of("A1", "A2");
    when(ucsbCurriculumService.getRequirementCodesByCollege("ENGR"))
        .thenReturn(fakeCodes);

    MvcResult response =
      mockMvc.perform(get("/api/public/generalEducationInfo")
                .param("collegeCode", "ENGR")
                .contentType("application/json"))
             .andExpect(status().isOk())
             .andReturn();

    String body = response.getResponse().getContentAsString();
    // JSON representation of ["A1","A2"]
    assertEquals("[\"A1\",\"A2\"]", body);
  }
}
