package edu.ucsb.cs156.courses.config;

import de.flapdoodle.embed.mongo.spring.autoconfigure.EmbeddedMongoAutoConfiguration;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Profile("development")
@Configuration
@EnableAutoConfiguration
@EnableMongoRepositories("edu.ucsb.cs156.courses.collections")
@EnableMongoAuditing(dateTimeProviderRef = "auditingDateTimeProvider")
public class MongoDevConfig extends EmbeddedMongoAutoConfiguration {

  @Bean(name = "auditingDateTimeProvider")
  public DateTimeProvider dateTimeProvider() {
    return () -> Optional.of(OffsetDateTime.now());
  }

  public void mongoInstance(@Autowired MongoTemplate mongoTemplate) {}
}
