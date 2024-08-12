package edu.ucsb.cs156.courses;

import edu.ucsb.cs156.courses.services.UCSBAPIQuarterService;
import edu.ucsb.cs156.courses.services.UCSBSubjectsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;

/** This class contains a `run` method that is called once at application startup time. */
@Slf4j
@Configuration
public class CoursesApplicationRunner implements ApplicationRunner {
  @Autowired UCSBAPIQuarterService ucsbAPIQuarterService;
  @Autowired UCSBSubjectsService ucsbSubjectsService;

  /**
   * Called once at application startup time. Put code here if you want it to run once each time the
   * Spring Boot application starts up.
   */
  @Override
  public void run(ApplicationArguments args) throws Exception {
    log.info("CoursesApplicationRunner.run called");
    ucsbSubjectsService.loadAllSubjects();
    ucsbAPIQuarterService.loadAllQuarters();
  }
}
