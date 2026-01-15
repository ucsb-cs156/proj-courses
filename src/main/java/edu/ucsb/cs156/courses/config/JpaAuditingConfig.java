package edu.ucsb.cs156.courses.config;

import java.time.ZonedDateTime;
import java.util.Optional;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

// enables automatic population of @CreatedDate and @LastModifiedDate
@EnableJpaAuditing(dateTimeProviderRef = "utcDateTimeProvider")
@Configuration
public class JpaAuditingConfig {

  @Bean
  public DateTimeProvider utcDateTimeProvider() {
    return () -> {
      ZonedDateTime now = ZonedDateTime.now();
      return Optional.of(now);
    };
  }
}
