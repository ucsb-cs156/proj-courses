package edu.ucsb.cs156.courses.services.Jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import edu.ucsb.cs156.courses.services.jobs.JobRateLimit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(classes = {JobRateLimit.class})
@TestPropertySource(properties = "app.rateLimitDelayMs=500")
public class JobRateLimitGoodPropertySourceTests {

  @Autowired private JobRateLimit jobRateLimit;

  @Test
  void test_rateLimitDelayMs() {
    int rateLimitDelayMs = jobRateLimit.getRateLimitDelayMs();
    assertEquals(500, rateLimitDelayMs, "Rate limit set from property source should be 500 ms");
  }

  @Test
  void test_sleep() throws InterruptedException {
    long startTime = System.currentTimeMillis();
    jobRateLimit.sleep();
    long endTime = System.currentTimeMillis();
    long elapsedTime = endTime - startTime;
    assertTrue(
        elapsedTime >= jobRateLimit.getRateLimitDelayMs(),
        "Sleep time should be at least the rate limit delay");
  }
}
