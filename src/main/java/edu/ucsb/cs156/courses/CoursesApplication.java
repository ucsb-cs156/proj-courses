package edu.ucsb.cs156.courses;

import java.time.ZonedDateTime;
import java.util.Optional;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;

@SpringBootApplication(
    excludeName = {"de.flapdoodle.embed.mongo.spring.autoconfigure.EmbeddedMongoAutoConfiguration"})
@EnableJpaAuditing(dateTimeProviderRef = "utcDateTimeProvider")
// enables automatic population of @CreatedDate and @LastModifiedDate
@EnableAsync // for @Async annotation for JobsService
@EnableScheduling // for @Scheduled annotation for JobsService
@EnableSpringDataWebSupport(
    pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class CoursesApplication {

  public static void main(String[] args) {
    SpringApplication.run(CoursesApplication.class, args);
  }

  @Bean
  public DateTimeProvider utcDateTimeProvider() {
    return () -> {
      ZonedDateTime now = ZonedDateTime.now();
      return Optional.of(now);
    };
  }

  // See: https://www.baeldung.com/spring-security-async-principal-propagation
  @Bean
  public DelegatingSecurityContextAsyncTaskExecutor taskExecutor(ThreadPoolTaskExecutor delegate) {
    return new DelegatingSecurityContextAsyncTaskExecutor(delegate);
  }

  // See: https://www.baeldung.com/spring-security-async-principal-propagation
  @Bean
  public ThreadPoolTaskExecutor threadPoolTaskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(2);
    executor.setMaxPoolSize(2);
    executor.setQueueCapacity(500);
    executor.setThreadNamePrefix("Courses-");
    executor.initialize();
    return executor;
  }

  // See: https://www.baeldung.com/spring-git-information
  @Bean
  public static PropertySourcesPlaceholderConfigurer placeholderConfigurer() {
    PropertySourcesPlaceholderConfigurer propsConfig = new PropertySourcesPlaceholderConfigurer();
    propsConfig.setLocation(new ClassPathResource("git.properties"));
    propsConfig.setIgnoreResourceNotFound(true);
    propsConfig.setIgnoreUnresolvablePlaceholders(true);
    return propsConfig;
  }
}
