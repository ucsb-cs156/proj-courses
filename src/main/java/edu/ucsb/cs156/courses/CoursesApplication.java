package edu.ucsb.cs156.courses;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing // enables automatic population of @CreatedDate and @LastModifiedDate
@EnableAsync // for @Async annotation for JobsService
public class CoursesApplication {

  public static void main(String[] args) {
    SpringApplication.run(CoursesApplication.class, args);
  }

}
