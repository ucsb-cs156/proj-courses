package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.services.UCSBAPIQuarterService;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import edu.ucsb.cs156.courses.services.jobs.JobService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * This class contains methods that are scheduled to run at certain times to launch particular jobs.
 *
 * <p>The value of the <code>cron</code> parameter to the <code>&#64;Scheduled</code> annotation is
 * a Spring Boot cron expression, which is similar to a Unix cron expression, but with an extra
 * field at the beginning for the seconds.
 *
 * @see <a href=
 *     "https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/support/CronExpression.html">Spring
 *     Cron Syntax</a>
 */
@Component("scheduledJobs")
@Slf4j
public class ScheduledJobs {

  @Autowired private JobService jobService;

  @Autowired private UpdateCourseDataJobFactory updateCourseDataJobFactory;

  @Autowired private UCSBAPIQuarterService ucsbAPIQuarterService;

  @Value("${app.startQtrYYYYQ:20221}")
  private String startQtrYYYYQ;

  @Value("${app.endQtrYYYYQ:20222}")
  private String endQtrYYYYQ;

  @Scheduled(cron = "${app.updateCourseData.cron}", zone = "${spring.jackson.time-zone}")
  public void runUpdateCourseDataBasedOnCron() throws Exception {
    log.info("runUpdateCourseDataBasedOnCron: running");

    String currentQuarterYYYYQ = ucsbAPIQuarterService.getCurrentQuarterYYYYQ();

    JobContextConsumer updateCourseDataJob =
        updateCourseDataJobFactory.createForQuarterRange(currentQuarterYYYYQ, endQtrYYYYQ);
    jobService.runAsJob(updateCourseDataJob);

    log.info(
        String.format(
            "runUpdateCourseDataBasedOnCron: launched job, startQtrYYYYQ=%s, endQtrYYYYQ=%s",
            currentQuarterYYYYQ, endQtrYYYYQ));
  }
}
