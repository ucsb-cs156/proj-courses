package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import java.util.ArrayList;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = UsersController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class UsersControllerTests extends ControllerTestCase {

  @MockBean UserRepository userRepository;

  ArrayList<User> emptyArray = new ArrayList<User>();
  PageRequest pageRequest_0_10_ASC_id = PageRequest.of(0, 10, Direction.ASC, "id");
  PageRequest pageRequest_0_10_DESC_email = PageRequest.of(0, 10, Direction.DESC, "email");

  private final Page<User> emptyPage_0_10_ASC_id =
      new PageImpl<User>(emptyArray, pageRequest_0_10_ASC_id, 0);
  private final Page<User> emptyPage_0_10_DESC_email =
      new PageImpl<User>(emptyArray, pageRequest_0_10_DESC_email, 0);

  @Test
  public void getUsersPaginated__logged_out() throws Exception {
    mockMvc
        .perform(get("/api/admin/users/paginated?page=0&pageSize=10"))
        .andExpect(status().is(403));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void getUsersPaginated__user_logged_in() throws Exception {
    mockMvc
        .perform(get("/api/admin/users/paginated?page=0&pageSize=10"))
        .andExpect(status().is(403));
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void getUsersPaginated__admin_logged_in__empty_page_default_sort() throws Exception {
    // arrange
    when(userRepository.findAll(pageRequest_0_10_ASC_id)).thenReturn(emptyPage_0_10_ASC_id);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/admin/users/paginated?page=0&pageSize=10"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedResponseAsJson = mapper.writeValueAsString(emptyPage_0_10_ASC_id);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void getUsersPaginated__admin_logged_in__empty_page_DESC_email_sort() throws Exception {
    // arrange
    when(userRepository.findAll(pageRequest_0_10_DESC_email)).thenReturn(emptyPage_0_10_DESC_email);

    // act
    MvcResult response =
        mockMvc
            .perform(
                get(
                    "/api/admin/users/paginated?page=0&pageSize=10&sortField=email&sortDirection=DESC"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedResponseAsJson = mapper.writeValueAsString(emptyPage_0_10_DESC_email);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void getUsersPaginated__invalid_sort_field() throws Exception {
    // act
    MvcResult response =
        mockMvc
            .perform(
                get(
                    "/api/admin/users/paginated?page=0&pageSize=10&sortField=invalid&sortDirection=ASC"))
            .andExpect(status().isBadRequest())
            .andReturn();

    // assert
    Map<String, String> expectedResponse =
        Map.of(
            "message",
            "invalid is not a valid sort field. Valid values are [id, email, givenName, familyName]",
            "type",
            "IllegalArgumentException");

    String expectedResponseAsJson = mapper.writeValueAsString(expectedResponse);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void getUsersPaginated__invalid_sort_direction() throws Exception {
    // act
    MvcResult response =
        mockMvc
            .perform(
                get(
                    "/api/admin/users/paginated?page=0&pageSize=10&sortField=id&sortDirection=INVALID"))
            .andExpect(status().isBadRequest())
            .andReturn();

    // assert
    Map<String, String> expectedResponse =
        Map.of(
            "message",
            "INVALID is not a valid sort direction. Valid values are [ASC, DESC]",
            "type",
            "IllegalArgumentException");

    String expectedResponseAsJson = mapper.writeValueAsString(expectedResponse);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }
}
