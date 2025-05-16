package edu.ucsb.cs156.courses.services.Jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.ucsb.cs156.courses.services.jobs.JobRateLimit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(classes = {JobRateLimit.class})
@TestPropertySource(properties = "app.rateLimitDelayMs=notANumber")
public class JobRateLimitBadPropertySourceTests {

  @Autowired private JobRateLimit jobRateLimit;

  // we expect that logger to be called with two warning messages
  // "Invalid rate limit delay: notANumber"
  // "Using default rate limit delay of 200 ms"

  @Test
  void test_rateLimitDelayMs() {
    int rateLimitDelayMs = jobRateLimit.getRateLimitDelayMs();
    assertEquals(
        200, rateLimitDelayMs, "Rate limit default when bad value passed should be 200 ms");
  }
}
