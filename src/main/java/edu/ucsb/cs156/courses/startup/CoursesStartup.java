package edu.ucsb.cs156.courses.startup;

import edu.ucsb.cs156.courses.jobs.UpdateCourseDataJobFactory;
import edu.ucsb.cs156.courses.models.Quarter;
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

  private static final int MIN_STARTUP_QUARTER_YEAR = 1980;
  private static final int MAX_STARTUP_QUARTER_YEAR = 2050;

  @Autowired UCSBAPIQuarterService ucsbAPIQuarterService;
  @Autowired UCSBSubjectsService ucsbSubjectsService;

  @Autowired private UpdateCourseDataJobFactory updateCourseDataJobFactory;

  @Autowired private JobService jobService;

  @Value("${app.startQtrYYYYQ:20221}")
  private String startQtrYYYYQ;

  /**
   * Called once at application startup time . Put code here if you want it to run once each time
   * the Spring Boot application starts up in all environments.
   */
  public void alwaysRunOnStartup() throws Exception {
    log.info("alwaysRunOnStartup called");
    validateStartupQuarter("START_QTR", startQtrYYYYQ);
    String endQtrYYYYQ = ucsbAPIQuarterService.getEndQtrYYYYQ();
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
            "CMPSC", startQtrYYYYQ, endQtrYYYYQ, true);
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
  private void validateStartupQuarter(String envVarName, String value) {
    if (isValidStartupQuarter(value)) {
      return;
    }

    String message =
        String.format(
            "Environment variable %s has invalid value '%s'. Expected format/range: YYYYQ with year %d-%d inclusive and final quarter digit 1, 2, 3, or 4. Example valid value: 20221.",
            envVarName, value, MIN_STARTUP_QUARTER_YEAR, MAX_STARTUP_QUARTER_YEAR);
    log.error(message);
    throw new RuntimeException(message);
  }

  private boolean isValidStartupQuarter(String value) {
    if (value == null || !value.matches("\\d{5}")) {
      return false;
    }

    int yyyyq;
    try {
      yyyyq = Quarter.yyyyqToInt(value);
    } catch (IllegalArgumentException e) {
      return false;
    }

    int year = yyyyq / 10;
    return year >= MIN_STARTUP_QUARTER_YEAR && year <= MAX_STARTUP_QUARTER_YEAR;
  }

  public void runOnStartupInProductionOnly() throws Exception {
    log.info("runOnStartupInProductionOnly called");
    // Launch course update job
    String endQtrYYYYQ = ucsbAPIQuarterService.getEndQtrYYYYQ();

    JobContextConsumer updateCourseDataJob =
        updateCourseDataJobFactory.createForQuarterRange(startQtrYYYYQ, endQtrYYYYQ, true);
    jobService.runAsJob(updateCourseDataJob);

    log.info(
        String.format(
            "runOnStartupInProductionOnly: launched updateCourseDataJob, startQtrYYYYQ=%s, endQtrYYYYQ=%s",
            startQtrYYYYQ, endQtrYYYYQ));
  }
}
