package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.ControllerTestCase;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest(classes = edu.ucsb.cs156.courses.CoursesApplication.class)
@AutoConfigureMockMvc
public class TestErrorControllerTests extends ControllerTestCase {

    @Test
    public void testErrorEndpoint_ThrowsException() throws Exception {
        try {
            MvcResult response = mockMvc.perform(get("/test-error"))
                    .andReturn();

            assertTrue(false, "Expected RuntimeException was not thrown");
        } catch (Exception e) {
            Throwable rootCause = getRootCause(e);
            assertTrue(rootCause instanceof RuntimeException, 
                    "Expected RuntimeException but got: " + rootCause.getClass().getName());
            assertEquals("This is a test exception to trigger the custom error page", 
                    rootCause.getMessage());
        }
    }

    private Throwable getRootCause(Throwable throwable) {
        Throwable cause = throwable.getCause();
        if (cause == null) {
            return throwable;
        }
        return getRootCause(cause);
    }
}
