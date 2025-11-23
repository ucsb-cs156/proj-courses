package edu.ucsb.cs156.courses.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = UsersController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class ApiControllerTests extends ControllerTestCase {

  @MockBean UserRepository userRepository;

  @Test
  public void usersControllerExists() throws Exception {
    // This test verifies that the UsersController is properly configured
    mockMvc
        .perform(get("/api/admin/users/paginated?page=0&pageSize=10"))
        .andExpect(status().is(403));
  }
}
