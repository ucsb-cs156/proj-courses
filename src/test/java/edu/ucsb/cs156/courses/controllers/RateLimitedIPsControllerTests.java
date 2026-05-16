package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.entities.RateLimitedIP;
import edu.ucsb.cs156.courses.repositories.RateLimitedIPRepository;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = RateLimitedIPsController.class)
public class RateLimitedIPsControllerTests extends ControllerTestCase {

  @MockBean RateLimitedIPRepository rateLimitedIPRepository;

  @MockBean UserRepository userRepository;

  @Autowired ObjectMapper objectMapper;

  private final ZonedDateTime sampleTime = ZonedDateTime.parse("2025-01-01T00:00:00+00:00[UTC]");

  private final RateLimitedIP ip1 =
      RateLimitedIP.builder()
          .ipAddress("192.168.1.1")
          .requestCount(5)
          .lastRequestAt(sampleTime)
          .build();

  private final RateLimitedIP ip2 =
      RateLimitedIP.builder()
          .ipAddress("10.0.0.1")
          .requestCount(3)
          .lastRequestAt(sampleTime.plusHours(1))
          .build();

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_get_paginated_rate_limited_ips() throws Exception {

    ArrayList<RateLimitedIP> ips = new ArrayList<>(Arrays.asList(ip1, ip2));
    PageRequest pageRequest = PageRequest.of(0, 10, Direction.DESC, "requestCount");
    Page<RateLimitedIP> page = new PageImpl<>(ips, pageRequest, 2);

    when(rateLimitedIPRepository.findAll(pageRequest)).thenReturn(page);

    MvcResult response =
        mockMvc
            .perform(
                get("/api/admin/rate-limited-ips")
                    .param("page", "0")
                    .param("pageSize", "10")
                    .param("sortField", "requestCount")
                    .param("sortDirection", "DESC"))
            .andExpect(status().isOk())
            .andReturn();

    verify(rateLimitedIPRepository, times(1)).findAll(pageRequest);
    String responseString = response.getResponse().getContentAsString();
    String expectedJson = objectMapper.writeValueAsString(page);
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_sort_by_lastRequestAt_asc() throws Exception {

    ArrayList<RateLimitedIP> ips = new ArrayList<>(Arrays.asList(ip1, ip2));
    PageRequest pageRequest = PageRequest.of(0, 10, Direction.ASC, "lastRequestAt");
    Page<RateLimitedIP> page = new PageImpl<>(ips, pageRequest, 2);

    when(rateLimitedIPRepository.findAll(pageRequest)).thenReturn(page);

    MvcResult response =
        mockMvc
            .perform(
                get("/api/admin/rate-limited-ips")
                    .param("page", "0")
                    .param("pageSize", "10")
                    .param("sortField", "lastRequestAt")
                    .param("sortDirection", "ASC"))
            .andExpect(status().isOk())
            .andReturn();

    verify(rateLimitedIPRepository, times(1)).findAll(pageRequest);
    String responseString = response.getResponse().getContentAsString();
    String expectedJson = objectMapper.writeValueAsString(page);
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_gets_bad_request_for_invalid_sort_field() throws Exception {

    MvcResult response =
        mockMvc
            .perform(
                get("/api/admin/rate-limited-ips")
                    .param("page", "0")
                    .param("pageSize", "10")
                    .param("sortField", "invalidField")
                    .param("sortDirection", "DESC"))
            .andExpect(status().isBadRequest())
            .andReturn();

    Map<String, Object> json = responseToJson(response);
    assertEquals("IllegalArgumentException", json.get("type"));
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_gets_bad_request_for_invalid_sort_direction() throws Exception {

    MvcResult response =
        mockMvc
            .perform(
                get("/api/admin/rate-limited-ips")
                    .param("page", "0")
                    .param("pageSize", "10")
                    .param("sortField", "requestCount")
                    .param("sortDirection", "INVALID"))
            .andExpect(status().isBadRequest())
            .andReturn();

    Map<String, Object> json = responseToJson(response);
    assertEquals("IllegalArgumentException", json.get("type"));
  }

  @Test
  public void non_admin_cannot_access_rate_limited_ips() throws Exception {
    mockMvc
        .perform(get("/api/admin/rate-limited-ips").param("page", "0").param("pageSize", "10"))
        .andExpect(status().is(403))
        .andReturn();
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void user_cannot_access_rate_limited_ips() throws Exception {
    mockMvc
        .perform(get("/api/admin/rate-limited-ips").param("page", "0").param("pageSize", "10"))
        .andExpect(status().is(403))
        .andReturn();
  }
}
