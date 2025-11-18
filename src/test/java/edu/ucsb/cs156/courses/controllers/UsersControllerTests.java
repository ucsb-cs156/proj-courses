package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = UsersController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class UsersControllerTests extends ControllerTestCase {

  @MockBean UserRepository userRepository;

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

    Page<User> fakePage = new PageImpl<>(List.of(u1, u2));

    when(userRepository.findAll(any(Pageable.class))).thenReturn(fakePage);

    String expectedJson = mapper.writeValueAsString(List.of(u1, u2));

    // act
    MvcResult response =
        mockMvc.perform(get("/api/admin/users")).andExpect(status().isOk()).andReturn();

    // assert
    verify(userRepository, times(1)).findAll(any(Pageable.class));
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  // ─────────────────────────────────────────────────────────────
  // New: paged endpoint test (keeps same style / structure)
  // ─────────────────────────────────────────────────────────────
  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void users_paged__admin_logged_in() throws Exception {

    // arrange
    User u1 = User.builder().id(1L).build();
    User u2 = User.builder().id(2L).build();

    Page<User> fakePage = new PageImpl<>(List.of(u1, u2));

    when(userRepository.findAll(any(Pageable.class))).thenReturn(fakePage);

    String expectedJson = mapper.writeValueAsString(fakePage);

    // act
    MvcResult response =
        mockMvc.perform(get("/api/admin/users/paged")).andExpect(status().isOk()).andReturn();

    // assert
    verify(userRepository, times(1)).findAll(any(Pageable.class));
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }
}
