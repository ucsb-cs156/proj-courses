package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.CurrentUserService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = EnrollmentHistoryController.class)
@Import(SecurityConfig.class)
public class EnrollmentHistoryControllerTests {
  private ObjectMapper mapper = new ObjectMapper();

  @Autowired private MockMvc mockMvc;

  @MockitoBean EnrollmentDataPointRepository enrollmentDataPointRepository;
  @MockitoBean UserRepository userRepository;
  @MockitoBean CurrentUserService currentUserService;

  @Test
  public void test_search_emptyRequest() throws Exception {
    List<EnrollmentDataPoint> expectedResult = new ArrayList<EnrollmentDataPoint>();
    String urlTemplate =
        "/api/public/enrollmenthistory/search?yyyyq=%s&subjectArea=%s&courseNumber=%s";

    String url = String.format(urlTemplate, "20222", "CMPSC", "8");

    when(enrollmentDataPointRepository.findByYyyyq(eq("20222"))).thenReturn(expectedResult);

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
    EnrollmentDataPoint edp1 =
        EnrollmentDataPoint.builder()
            .yyyyq("20222")
            .enrollCd("08268")
            .courseId("CMPSC     8")
            .section("0100")
            .enrollment(45)
            .build();

    EnrollmentDataPoint edp2 =
        EnrollmentDataPoint.builder()
            .yyyyq("20222")
            .enrollCd("08276")
            .courseId("CMPSC     8")
            .section("0101")
            .enrollment(42)
            .build();

    String urlTemplate =
        "/api/public/enrollmenthistory/search?yyyyq=%s&subjectArea=%s&courseNumber=%s";
    String url = String.format(urlTemplate, "20222", "CMPSC", "8");

    List<EnrollmentDataPoint> expectedResult = new ArrayList<EnrollmentDataPoint>();
    expectedResult.addAll(Arrays.asList(edp1, edp2));

    when(enrollmentDataPointRepository.findByYyyyq(eq("20222"))).thenReturn(expectedResult);

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    String expectedString = mapper.writeValueAsString(expectedResult);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }

  @Test
  public void test_search_validRequest_withSuffix() throws Exception {
    EnrollmentDataPoint edp1 =
        EnrollmentDataPoint.builder()
            .yyyyq("20222")
            .enrollCd("08268")
            .courseId("CMPSC   130A ")
            .section("0100")
            .enrollment(45)
            .build();

    String urlTemplate =
        "/api/public/enrollmenthistory/search?yyyyq=%s&subjectArea=%s&courseNumber=%s";
    String url = String.format(urlTemplate, "20222", "CMPSC", "130A");

    List<EnrollmentDataPoint> expectedResult = new ArrayList<EnrollmentDataPoint>();
    expectedResult.add(edp1);

    when(enrollmentDataPointRepository.findByYyyyq(eq("20222"))).thenReturn(expectedResult);

    MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

    String expectedString = mapper.writeValueAsString(expectedResult);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedString, responseString);
  }
}
