package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.collections.UpdateCollection;
import edu.ucsb.cs156.courses.documents.Update;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import java.util.ArrayList;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = {UpdateController.class})
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class UpdateControllerTests extends ControllerTestCase {

  @MockBean UpdateCollection updateCollection;

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  ArrayList<Update> emptyArray = new ArrayList<Update>();
  PageRequest pageRequest_0_10_DESC_lastUpdate =
      PageRequest.of(0, 10, Direction.DESC, "lastUpdate");
  private final Page<Update> emptyPage_0_10_DESC_lastUpdate =
      new PageImpl<Update>(emptyArray, pageRequest_0_10_DESC_lastUpdate, 0);

  @Test
  @WithMockUser(roles = {"ADMIN"})
  public void test_getUpdates_ALL_ALL_empty() throws Exception {

    // arrange

    when(updateCollection.findAll(pageRequest_0_10_DESC_lastUpdate))
        .thenReturn(emptyPage_0_10_DESC_lastUpdate);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/updates?subjectArea=ALL&quarter=ALL&page=0&pageSize=10"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedResponseAsJson = objectMapper.writeValueAsString(emptyPage_0_10_DESC_lastUpdate);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }

  @Test
  @WithMockUser(roles = {"ADMIN"})
  public void test_getUpdates_CMPSC_ALL_empty() throws Exception {

    // arrange

    when(updateCollection.findBySubjectArea("CMPSC", pageRequest_0_10_DESC_lastUpdate))
        .thenReturn(emptyPage_0_10_DESC_lastUpdate);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/updates?subjectArea=CMPSC&quarter=ALL&page=0&pageSize=10"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedResponseAsJson = objectMapper.writeValueAsString(emptyPage_0_10_DESC_lastUpdate);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }

  @Test
  @WithMockUser(roles = {"ADMIN"})
  public void test_getUpdates_ALL_20221_empty() throws Exception {

    // arrange

    when(updateCollection.findByQuarter("20221", pageRequest_0_10_DESC_lastUpdate))
        .thenReturn(emptyPage_0_10_DESC_lastUpdate);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/updates?subjectArea=ALL&quarter=20221&page=0&pageSize=10"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedResponseAsJson = objectMapper.writeValueAsString(emptyPage_0_10_DESC_lastUpdate);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }

  @Test
  @WithMockUser(roles = {"ADMIN"})
  public void test_getUpdates_CMPSC_20221_empty() throws Exception {

    // arrange

    when(updateCollection.findBySubjectAreaAndQuarter(
            "CMPSC", "20221", pageRequest_0_10_DESC_lastUpdate))
        .thenReturn(emptyPage_0_10_DESC_lastUpdate);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/updates?subjectArea=CMPSC&quarter=20221&page=0&pageSize=10"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedResponseAsJson = objectMapper.writeValueAsString(emptyPage_0_10_DESC_lastUpdate);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }
}
