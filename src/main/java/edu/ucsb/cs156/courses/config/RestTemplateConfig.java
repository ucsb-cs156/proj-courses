package edu.ucsb.cs156.courses.config;

import java.time.Duration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

  /*
   * A RestTemplate built with no timeout blocks its calling thread forever on a hung external
   * call. That's a real incident lib-jobs' single-threaded jobsExecutor hit on another app
   * (proj-scaffold): a job stuck this way permanently wedged the executor, with no way to recover
   * short of restarting the app (see lib-jobs DESIGN.md 9 -- cooperative job cancellation only
   * helps a job that reaches another checkpoint, which a truly hung thread never will). Generous
   * but finite: long enough to never trip on legitimate slowness, short enough to guarantee a job
   * can't hang forever.
   */
  private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(10);
  private static final Duration READ_TIMEOUT = Duration.ofSeconds(60);

  @Bean
  public RestTemplate restTemplate(RestTemplateBuilder builder) {
    return builder.connectTimeout(CONNECT_TIMEOUT).readTimeout(READ_TIMEOUT).build();
  }
}
