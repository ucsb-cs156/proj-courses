package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.EnrollmentCSVService;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = {EnrollmentController.class})
@Import(TestConfig.class)
public class EnrollmentDataPointControllerTests extends ControllerTestCase {

  @MockitoBean EnrollmentDataPointRepository enrollmentDataPointRepository;
  @MockitoBean private EnrollmentCSVService enrollmentCSVService;
  @MockitoBean UserRepository userRepository;

  @Test
  public void search_returns_course_enrollment_history() throws Exception {
    List<EnrollmentDataPoint> expected =
        List.of(
            dataPoint(1L, "20252", "12345", "CMPSC   130A -1", "0100", 96, "2026-01-01T09:00:00"),
            dataPoint(2L, "20252", "23456", "CMPSC   130A -2", "0200", 75, "2026-01-01T10:00:00"));

    when(enrollmentDataPointRepository.findByQuarterRangeAndCourseIdAndOptionalFilters(
            eq("20251"), eq("20252"), eq("CMPSC   130A"), isNull(), isNull()))
        .thenReturn(expected);

    MvcResult response =
        mockMvc
            .perform(
                get("/api/enrollment/search")
                    .param("startQtr", "20251")
                    .param("endQtr", "20252")
                    .param("subjectArea", "CMPSC")
                    .param("courseNumber", "130A"))
            .andExpect(status().isOk())
            .andReturn();

    String expectedResponseAsJson = mapper.writeValueAsString(expected);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }

  @Test
  public void search_returns_section_enrollment_history_when_optional_filters_are_present()
      throws Exception {
    List<EnrollmentDataPoint> expected =
        List.of(
            dataPoint(3L, "20252", "12345", "CMPSC   130A -1", "0100", 96, "2026-01-01T09:00:00"));

    when(enrollmentDataPointRepository.findByQuarterRangeAndCourseIdAndOptionalFilters(
            eq("20252"), eq("20252"), eq("CMPSC   130A"), eq("12345"), eq("0100")))
        .thenReturn(expected);

    MvcResult response =
        mockMvc
            .perform(
                get("/api/enrollment/search")
                    .param("startQtr", "20252")
                    .param("endQtr", "20252")
                    .param("subjectArea", "CMPSC")
                    .param("courseNumber", "130A")
                    .param("enrollCd", "12345")
                    .param("section", "0100"))
            .andExpect(status().isOk())
            .andReturn();

    String expectedResponseAsJson = mapper.writeValueAsString(expected);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }

  @Test
  public void search_returns_empty_list_when_no_data_matches() throws Exception {
    List<EnrollmentDataPoint> expected = List.of();

    when(enrollmentDataPointRepository.findByQuarterRangeAndCourseIdAndOptionalFilters(
            eq("20252"), eq("20252"), eq("MATH      3B"), isNull(), isNull()))
        .thenReturn(expected);

    MvcResult response =
        mockMvc
            .perform(
                get("/api/enrollment/search")
                    .param("startQtr", "20252")
                    .param("endQtr", "20252")
                    .param("subjectArea", "MATH")
                    .param("courseNumber", "3B"))
            .andExpect(status().isOk())
            .andReturn();

    String expectedResponseAsJson = mapper.writeValueAsString(expected);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }

  private EnrollmentDataPoint dataPoint(
      Long id,
      String yyyyq,
      String enrollCd,
      String courseId,
      String section,
      int enrollment,
      String dateCreated) {
    return EnrollmentDataPoint.builder()
        .id(id)
        .yyyyq(yyyyq)
        .enrollCd(enrollCd)
        .courseId(courseId)
        .section(section)
        .enrollment(enrollment)
        .dateCreated(LocalDateTime.parse(dateCreated))
        .build();
  }
}
