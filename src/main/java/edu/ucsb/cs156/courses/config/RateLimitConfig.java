package edu.ucsb.cs156.courses.config;

import edu.ucsb.cs156.courses.filters.RateLimitFilter;
import edu.ucsb.cs156.courses.repositories.RateLimitedIPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RateLimitConfig {

  @Value("${app.ratelimit.initialBucketSize}")
  private int initialBucketSize;

  @Value("${app.ratelimit.refillPerMinute}")
  private int refillPerMinute;

  @Autowired private RateLimitedIPRepository rateLimitedIPRepository;

  @Bean
  public RateLimitFilter rateLimitFilter() {
    return new RateLimitFilter(initialBucketSize, refillPerMinute, rateLimitedIPRepository);
  }
}
