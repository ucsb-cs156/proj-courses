package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

public class TestErrorControllerTests {

  @Test
  public void testError_throwsRuntimeException() {
    TestErrorController controller = new TestErrorController();

    RuntimeException exception = assertThrows(RuntimeException.class, () -> controller.testError());

    assertEquals(
        "This is a test exception to trigger the custom error page", exception.getMessage());
  }
}
