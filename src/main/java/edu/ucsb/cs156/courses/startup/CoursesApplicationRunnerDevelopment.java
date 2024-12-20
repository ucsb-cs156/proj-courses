package edu.ucsb.cs156.courses.startup;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/** This class contains a `run` method that is called once at application startup time. */
@Slf4j
@Configuration
@Profile("development")
public class CoursesApplicationRunnerDevelopment implements ApplicationRunner {

  @Autowired CoursesStartup coursesStartup;

  /** Called once at application startup time, development only */
  @Override
  public void run(ApplicationArguments args) throws Exception {
    log.info("CoursesApplicationRunnerDevelopment.run called");
    coursesStartup.alwaysRunOnStartup();
  }
}
