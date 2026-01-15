package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
public class UsersControllerTests extends ControllerTestCase {

  @MockBean UserRepository userRepository;

  @Autowired private ObjectMapper objectMapper;

  PageRequest pageRequest_0_5_ASC = PageRequest.of(0, 5, Direction.ASC, "id");
  PageRequest pageRequest_0_5_DESC = PageRequest.of(0, 5, Direction.DESC, "id");

  @Test
  public void users__logged_out() throws Exception {
    mockMvc.perform(get("/api/admin/users")).andExpect(status().is(403));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void users__user_logged_in() throws Exception {
    mockMvc.perform(get("/api/admin/users")).andExpect(status().is(403));
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void users__admin_logged_in() throws Exception {

    // arrange

    User u1 = User.builder().id(1L).build();
    User u2 = User.builder().id(2L).build();
    User u = currentUserService.getCurrentUser().getUser();

    ArrayList<User> expectedUsers = new ArrayList<>();
    expectedUsers.addAll(Arrays.asList(u1, u2, u));

    when(userRepository.findAll()).thenReturn(expectedUsers);
    String expectedJson = mapper.writeValueAsString(expectedUsers);

    // act

    MvcResult response =
        mockMvc.perform(get("/api/admin/users")).andExpect(status().isOk()).andReturn();

    // assert

    verify(userRepository, times(1)).findAll();
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void usersPaged__admin_logged_in_asc() throws Exception {
    // arrange

    User u1 = User.builder().id(1L).build();
    User u2 = User.builder().id(2L).build();
    User u = currentUserService.getCurrentUser().getUser();

    ArrayList<User> expectedUsers = new ArrayList<>();
    expectedUsers.addAll(Arrays.asList(u1, u2, u));

    Page<User> testPage_0_5_ASC = new PageImpl<User>(expectedUsers, pageRequest_0_5_ASC, 3);

    when(userRepository.findAll(pageRequest_0_5_ASC)).thenReturn(testPage_0_5_ASC);
    String expectedJson = objectMapper.writeValueAsString(testPage_0_5_ASC);

    // act

    MvcResult response =
        mockMvc
            .perform(
                get("/api/admin/users")
                    .param("page", "0")
                    .param("pageSize", "5")
                    .param("sortDirection", "ASC"))
            .andExpect(status().isOk())
            .andReturn();

    // assert

    verify(userRepository, times(1))
        .findAll(
            org.springframework.data.domain.PageRequest.of(
                0, 5, org.springframework.data.domain.Sort.Direction.ASC, "id"));
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void usersPaged__admin_logged_in_desc() throws Exception {
    // arrange

    User u1 = User.builder().id(1L).build();
    User u2 = User.builder().id(2L).build();
    User u = currentUserService.getCurrentUser().getUser();

    ArrayList<User> expectedUsers = new ArrayList<>();
    expectedUsers.addAll(Arrays.asList(u1, u2, u));

    Page<User> testPage_0_5_DESC = new PageImpl<User>(expectedUsers, pageRequest_0_5_DESC, 3);

    when(userRepository.findAll(pageRequest_0_5_DESC)).thenReturn(testPage_0_5_DESC);
    String expectedJson = objectMapper.writeValueAsString(testPage_0_5_DESC);
    // act

    MvcResult response =
        mockMvc
            .perform(
                get("/api/admin/users")
                    .param("page", "0")
                    .param("pageSize", "5")
                    .param("sortDirection", "DESC"))
            .andExpect(status().isOk())
            .andReturn();

    // assert

    verify(userRepository, times(1))
        .findAll(
            org.springframework.data.domain.PageRequest.of(
                0, 5, org.springframework.data.domain.Sort.Direction.DESC, "id"));
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void usersPaged__fails_when_invalid_sortDirection() throws Exception {

    MvcResult response =
        mockMvc
            .perform(
                get("/api/admin/users")
                    .param("page", "0")
                    .param("pageSize", "5")
                    .param("sortDirection", "INVALID"))
            .andExpect(status().isBadRequest())
            .andReturn();

    Map<String, String> expectedResponse =
        Map.of(
            "message",
            "INVALID is not a valid sort direction.  Valid values are [ASC, DESC]",
            "type",
            "IllegalArgumentException");

    // assert

    String expectedResponseAsJson = objectMapper.writeValueAsString(expectedResponse);
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponseAsJson, actualResponse);
  }
}
