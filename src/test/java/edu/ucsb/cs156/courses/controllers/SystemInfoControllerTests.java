package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.models.SystemInfo;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.SystemInfoService;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = SystemInfoController.class)
public class SystemInfoControllerTests extends ControllerTestCase {

  @MockBean
  UserRepository userRepository;

  @MockBean
  SystemInfoService mockSystemInfoService;

  @Test
  public void systemInfo__logged_out() throws Exception {
    // arrange

    SystemInfo systemInfo = SystemInfo
        .builder()
        .showSwaggerUILink(true)
        .springH2ConsoleEnabled(true)
        .startQtrYYYYQ("20221")
        .endQtrYYYYQ("20222")
        .build();
    when(mockSystemInfoService.getSystemInfo()).thenReturn(systemInfo);
    String expectedJson = mapper.writeValueAsString(systemInfo);

    // act
    MvcResult response = mockMvc.perform(get("/api/systemInfo"))
        .andExpect(status().isOk()).andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  

  @WithMockUser(roles = { "USER" })
  @Test
  public void systemInfo__user_logged_in() throws Exception {
    // arrange

    SystemInfo systemInfo = SystemInfo
        .builder()
        .showSwaggerUILink(true)
        .springH2ConsoleEnabled(true)
        .startQtrYYYYQ("20221")
        .endQtrYYYYQ("20222")
        .build();
    when(mockSystemInfoService.getSystemInfo()).thenReturn(systemInfo);
    String expectedJson = mapper.writeValueAsString(systemInfo);

    // act
    MvcResult response = mockMvc.perform(get("/api/systemInfo"))
        .andExpect(status().isOk()).andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = { "ADMIN", "USER" })
  @Test
  public void systemInfo__admin_logged_in() throws Exception {

    // arrange

    SystemInfo systemInfo = SystemInfo
        .builder()
        .showSwaggerUILink(true)
        .springH2ConsoleEnabled(true)
        .startQtrYYYYQ("20221")
        .endQtrYYYYQ("20222")
        .build();
    when(mockSystemInfoService.getSystemInfo()).thenReturn(systemInfo);
    String expectedJson = mapper.writeValueAsString(systemInfo);

    // act
    MvcResult response = mockMvc.perform(get("/api/systemInfo"))
        .andExpect(status().isOk()).andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }
}
