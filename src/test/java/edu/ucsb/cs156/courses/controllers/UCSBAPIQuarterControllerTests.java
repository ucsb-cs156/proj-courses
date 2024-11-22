package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.entities.UCSBAPIQuarter;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBAPIQuarterService;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = UCSBAPIQuarterController.class)
@Import(SecurityConfig.class)
@AutoConfigureDataJpa
public class UCSBAPIQuarterControllerTests extends ControllerTestCase {

  @MockBean UserRepository userRepository;

  @Autowired private MockMvc mockMvc;

  @MockBean private UCSBAPIQuarterService ucsbAPIQuarterService;

  @Autowired private ObjectMapper objectMapper;

  @Test
  public void test_currentQuarter() throws Exception {

    UCSBAPIQuarter expectedResult =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, UCSBAPIQuarter.class);

    String url = "/api/public/currentQuarter";

    when(ucsbAPIQuarterService.getCurrentQuarter()).thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();

    assertEquals(
        expectedResult,
        objectMapper.readValue(response.getResponse().getContentAsString(), UCSBAPIQuarter.class));
  }

  @Test
  public void test_allQuarters() throws Exception {

    UCSBAPIQuarter M23 =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, UCSBAPIQuarter.class);

    List<UCSBAPIQuarter> expectedResult = new ArrayList<UCSBAPIQuarter>();
    expectedResult.add(M23);

    String url = "/api/public/allQuarters";

    when(ucsbAPIQuarterService.getAllQuarters()).thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();

    assertEquals(
        expectedResult,
        objectMapper.readValue(
            response.getResponse().getContentAsString(),
            new TypeReference<List<UCSBAPIQuarter>>() {}));
  }

  @Test
  @WithMockUser(roles = {"ADMIN"})
  public void test_loadQuarters() throws Exception {

    UCSBAPIQuarter M23 =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, UCSBAPIQuarter.class);

    List<UCSBAPIQuarter> expectedResult = new ArrayList<UCSBAPIQuarter>();
    expectedResult.add(M23);

    String url = "/api/public/loadQuarters";

    when(ucsbAPIQuarterService.loadAllQuarters()).thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(post(url).contentType("application/json").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    assertEquals(
        expectedResult,
        objectMapper.readValue(
            response.getResponse().getContentAsString(),
            new TypeReference<List<UCSBAPIQuarter>>() {}));
  }

  @Test
  public void test_quarterList_S20_F19() throws Exception {
    ArrayList<Quarter> expected = new ArrayList<Quarter>();
    expected.add(new Quarter("S20"));
    expected.add(new Quarter("W20"));
    expected.add(new Quarter("F19"));
    assertEquals(expected, Quarter.quarterList("20202", "20194"));
  }

  @Test
  public void test_quarterList_S20_F19_1() throws Exception {
    ArrayList<Quarter> expected = new ArrayList<Quarter>();
    expected.add(new Quarter("S20"));
    assertEquals(expected, Quarter.quarterList("20202", "20202"));
  }

  @Test
  public void test_quarterList_F19_S20() throws Exception {
    List<Quarter> expected = new ArrayList<Quarter>();
    expected.add(new Quarter("F19"));
    expected.add(new Quarter("W20"));
    expected.add(new Quarter("S20"));

    assertEquals(expected, Quarter.quarterList("20194", "20202"));
  }
}
