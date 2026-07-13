package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

import edu.ucsb.cs156.jobs.services.JobContext;
import org.junit.jupiter.api.Test;

public class TestJobTests {

  @Test
  public void logs_hello_sleeps_and_says_goodbye() throws Exception {
    JobContext ctx = mock(JobContext.class);
    TestJob testJob = TestJob.builder().fail(false).sleepMs(50).build();

    long start = System.nanoTime();
    testJob.accept(ctx);
    long elapsedMs = (System.nanoTime() - start) / 1_000_000;

    assertTrue(elapsedMs >= 45, "slept only " + elapsedMs + " ms");
    verify(ctx).log("Hello World! from test job!");
    verify(ctx).log("Goodbye from test job!");
    verifyNoMoreInteractions(ctx);
  }

  @Test
  public void throws_and_skips_goodbye_when_fail_is_true() {
    JobContext ctx = mock(JobContext.class);
    TestJob testJob = TestJob.builder().fail(true).sleepMs(0).build();

    Exception thrown = assertThrows(Exception.class, () -> testJob.accept(ctx));

    assertEquals("Fail!", thrown.getMessage());
    verify(ctx).log("Hello World! from test job!");
    verifyNoMoreInteractions(ctx);
  }
}
