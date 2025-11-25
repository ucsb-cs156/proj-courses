package edu.ucsb.cs156.courses.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import edu.ucsb.cs156.courses.ControllerTestCase;
import jakarta.servlet.RequestDispatcher;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest(classes = edu.ucsb.cs156.courses.CoursesApplication.class)
@AutoConfigureMockMvc
public class CustomErrorControllerTests extends ControllerTestCase {

  @Test
  public void testHandleError_404() throws Exception {
    MvcResult response =
        mockMvc
            .perform(
                get("/error")
                    .requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 404)
                    .requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/some-non-existent-page"))
            .andExpect(status().isOk())
            .andExpect(view().name("error"))
            .andExpect(model().attributeExists("status", "error", "message", "timestamp", "path"))
            .andExpect(model().attribute("status", 404))
            .andExpect(model().attribute("error", HttpStatus.NOT_FOUND.getReasonPhrase()))
            .andExpect(
                model()
                    .attribute(
                        "message",
                        "The page you are looking for might have been removed or is temporarily unavailable"))
            .andReturn();
  }

  @Test
  public void testHandleError_403() throws Exception {
    MvcResult response =
        mockMvc
            .perform(
                get("/error")
                    .requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 403)
                    .requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/admin/something"))
            .andExpect(status().isOk())
            .andExpect(view().name("error"))
            .andExpect(model().attributeExists("status", "error", "message", "timestamp", "path"))
            .andExpect(model().attribute("status", 403))
            .andExpect(model().attribute("error", HttpStatus.FORBIDDEN.getReasonPhrase()))
            .andExpect(
                model().attribute("message", "You don't have permission to access this resource"))
            .andReturn();
  }

  @Test
  public void testHandleError_500() throws Exception {
    Exception testException = new RuntimeException("Test exception");
    MvcResult response =
        mockMvc
            .perform(
                get("/error")
                    .requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 500)
                    .requestAttr(RequestDispatcher.ERROR_EXCEPTION, testException)
                    .requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/api/something"))
            .andExpect(status().isOk())
            .andExpect(view().name("error"))
            .andExpect(
                model()
                    .attributeExists(
                        "status",
                        "error",
                        "message",
                        "exceptionMessage",
                        "stackTrace",
                        "timestamp",
                        "path"))
            .andExpect(model().attribute("status", 500))
            .andExpect(
                model().attribute("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase()))
            .andExpect(model().attribute("message", "We're sorry, something went wrong on our end"))
            .andExpect(model().attribute("exceptionMessage", "Test exception"))
            // CHANGE THIS LINE:
            .andExpect(
                model()
                    .attribute(
                        "stackTrace",
                        org.hamcrest.Matchers.containsString("CustomErrorControllerTests")))
            .andReturn();
  }

  @Test
  public void testHandleError_DefaultStatus() throws Exception {
    MvcResult response =
        mockMvc
            .perform(
                get("/error")
                    .requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/some-path")
                    .requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 400))
            .andExpect(status().isOk())
            .andExpect(view().name("error"))
            .andExpect(model().attributeExists("status", "error", "message", "timestamp", "path"))
            .andExpect(model().attribute("status", 400))
            .andExpect(model().attribute("error", HttpStatus.BAD_REQUEST.getReasonPhrase()))
            .andExpect(model().attribute("message", "An unexpected error occurred"))
            .andReturn();
  }

  @Test
  public void testHandleError_NoException() throws Exception {
    MvcResult response =
        mockMvc
            .perform(
                get("/error")
                    .requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 500)
                    .requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/api/something"))
            .andExpect(status().isOk())
            .andExpect(view().name("error"))
            .andExpect(
                model()
                    .attributeExists(
                        "status", "error", "message", "exceptionMessage", "timestamp", "path"))
            .andExpect(model().attribute("status", 500))
            .andExpect(model().attribute("exceptionMessage", "No exception details available"))
            .andReturn();
  }

  @Test
  public void testHandleError_NoStatusCode() throws Exception {
    MvcResult response =
        mockMvc
            .perform(
                get("/error").requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/api/something"))
            .andExpect(status().isOk())
            .andExpect(view().name("error"))
            .andExpect(
                model()
                    .attributeExists(
                        "status", "error", "message", "exceptionMessage", "timestamp", "path"))
            .andExpect(model().attribute("exceptionMessage", "No exception details available"))
            .andReturn();
  }
}
