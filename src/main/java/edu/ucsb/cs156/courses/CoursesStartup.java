package edu.ucsb.cs156.courses;

import edu.ucsb.cs156.courses.jobs.UpdateCourseDataJobFactory;
import edu.ucsb.cs156.courses.services.UCSBAPIQuarterService;
import edu.ucsb.cs156.courses.services.UCSBSubjectsService;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import edu.ucsb.cs156.courses.services.jobs.JobService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** This class contains a `run` method that is called once at application startup time. */
@Slf4j
@Component
public class CoursesStartup {

  @Autowired UCSBAPIQuarterService ucsbAPIQuarterService;
  @Autowired UCSBSubjectsService ucsbSubjectsService;

  @Autowired private UpdateCourseDataJobFactory updateCourseDataJobFactory;

  @Autowired private JobService jobService;

  @Value("${app.startQtrYYYYQ:20221}")
  private String startQtrYYYYQ;

  @Value("${app.endQtrYYYYQ:20222}")
  private String endQtrYYYYQ;

  /**
   * Called once at application startup time . Put code here if you want it to run once each time
   * the Spring Boot application starts up in all environments.
   */
  public void alwaysRunOnStartup() {
    log.info("alwaysRunOnStartup called");
    try {
      ucsbSubjectsService.loadAllSubjects();
    } catch (Exception e) {
      log.error("Error in ucsbSubjectsService.loadAllSubjects():", e);
    }

    try {
      ucsbAPIQuarterService.loadAllQuarters();
    } catch (Exception e) {
      log.error("Error in ucsbAPIQuarterService.loadAllQuarters():", e);
    }

    JobContextConsumer updateCourseDataJob =
        updateCourseDataJobFactory.createForSubjectAndQuarterRange(
            "CMPSC", startQtrYYYYQ, endQtrYYYYQ);
    jobService.runAsJob(updateCourseDataJob);

    log.info(
        String.format(
            "runOnStartupInProductionOnly: launched updateCourseDataJob, subjectArea=CMPSC, startQtrYYYYQ=%s, endQtrYYYYQ=%s",
            startQtrYYYYQ, endQtrYYYYQ));
  }

  /**
   * Called once at application startup time . Put code here if you want it to run once each time
   * the Spring Boot application starts up but only in production.
   */
  public void runOnStartupInProductionOnly() {
    log.info("runOnStartupInProductionOnly called");
    // Launch course update job

    JobContextConsumer updateCourseDataJob =
        updateCourseDataJobFactory.createForQuarterRange(startQtrYYYYQ, endQtrYYYYQ);
    jobService.runAsJob(updateCourseDataJob);

    log.info(
        String.format(
            "runOnStartupInProductionOnly: launched updateCourseDataJob, startQtrYYYYQ=%s, endQtrYYYYQ=%s",
            startQtrYYYYQ, endQtrYYYYQ));
  }
}
