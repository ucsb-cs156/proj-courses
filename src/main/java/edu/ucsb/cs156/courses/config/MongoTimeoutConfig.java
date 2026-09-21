package edu.ucsb.cs156.courses.config;

import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Limits how long the MongoDB driver waits for a usable server before giving up.
 *
 * <p>The driver's default is 30 seconds. When MongoDB is unreachable, that makes every request that
 * touches MongoDB hang for 30 seconds before failing, including the health check at
 * /api/actuator/health, which every open browser tab polls once a minute, and which an uptime
 * monitor may give up on before it answers. See docs/healthcheck.md.
 *
 * <p>When MongoDB is healthy this wait is never used, so a short value costs nothing.
 */
@Configuration
public class MongoTimeoutConfig {

  @Bean
  public MongoClientSettingsBuilderCustomizer mongoServerSelectionTimeout(
      @Value("${app.mongo.serverSelectionTimeoutSeconds:5}") int seconds) {
    return builder ->
        builder.applyToClusterSettings(
            cluster -> cluster.serverSelectionTimeout(seconds, TimeUnit.SECONDS));
  }
}
