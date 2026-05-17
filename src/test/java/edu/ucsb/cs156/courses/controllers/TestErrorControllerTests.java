package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = TestErrorController.class)
public class TestErrorControllerTests extends ControllerTestCase {
  @MockBean private UserRepository userRepository;

  @Test
  public void testErrorEndpoint_ThrowsException() throws Exception {
    // This test verifies that the /test-error endpoint throws a RuntimeException
    // with the expected message

    try {
      MvcResult response = mockMvc.perform(get("/test-error")).andReturn();

      // If we get here, the test failed because the endpoint should have thrown an exception
      assertTrue(false, "Expected RuntimeException was not thrown");
    } catch (Exception e) {
      // Verify that the exception is a RuntimeException with the expected message
      Throwable rootCause = getRootCause(e);
      assertTrue(
          rootCause instanceof RuntimeException,
          "Expected RuntimeException but got: " + rootCause.getClass().getName());
      assertEquals(
          "This is a test exception to trigger the custom error page", rootCause.getMessage());
    }
  }

  /** Helper method to get the root cause of an exception */
  private Throwable getRootCause(Throwable throwable) {
    Throwable cause = throwable.getCause();
    if (cause == null) {
      return throwable;
    }
    return getRootCause(cause);
  }
}
