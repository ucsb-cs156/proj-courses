package edu.ucsb.cs156.courses.services.jobs;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Component
@Slf4j
public class JobRateLimit {

  /**
   * The delay in milliseconds to be used for rate limiting. This value is set from the application
   * properties.
   */
  private int rateLimitDelayMs;

  public JobRateLimit(@Value("${app.rateLimitDelayMs}") String rateLimitDelayMsString) {
    try {
      rateLimitDelayMs = Integer.parseInt(rateLimitDelayMsString);
    } catch (NumberFormatException e) {
      rateLimitDelayMs = 200;
      log.warn("Invalid rate limit delay: " + rateLimitDelayMsString);
      log.warn(String.format("Using default rate limit delay of %d ms", rateLimitDelayMs));
    }
  }

  public void sleep() throws InterruptedException {
    Thread.sleep(rateLimitDelayMs);
  }

  public int getRateLimitDelayMs() {
    return rateLimitDelayMs;
  }
}
