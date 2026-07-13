package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.jobs.TestJob;
import edu.ucsb.cs156.courses.jobs.UpdateCourseDataJobFactory;
import edu.ucsb.cs156.courses.jobs.UploadGradeDataJob;
import edu.ucsb.cs156.courses.jobs.UploadGradeDataJobFactory;
import edu.ucsb.cs156.jobs.entities.Job;
import edu.ucsb.cs156.jobs.services.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Launch endpoints for this app's concrete jobs. The generic admin endpoints (list jobs, get
 * paginated jobs, get logs, delete jobs) come from the lib-jobs library's own controller.
 */
@Tag(name = "Jobs")
@RequestMapping("/api/jobs")
@RestController
@Slf4j
public class JobsController extends ApiController {

  @Autowired private JobService jobService;

  @Autowired UpdateCourseDataJobFactory updateCourseDataJobFactory;

  @Autowired UploadGradeDataJobFactory updateGradeDataJobFactory;

  @Operation(summary = "Launch Job to Update Course Data")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/launch/updateCourses")
  public Job launchUpdateCourseDataJob(
      @Parameter(name = "quarterYYYYQ", description = "quarter (YYYYQ format)") @RequestParam
          String quarterYYYYQ,
      @Parameter(name = "subjectArea") @RequestParam String subjectArea,
      @Parameter(
              name = "ifStale",
              description = "true if job should only update when data is stale")
          @RequestParam(defaultValue = "true")
          Boolean ifStale) {

    log.info(
        "launchUpdateCourseDataJob: quarterYYYYQ={}, subjectArea={}, ifStale={}",
        quarterYYYYQ,
        subjectArea,
        ifStale);
    var job =
        updateCourseDataJobFactory.createForSubjectAndQuarterAndIfStale(
            subjectArea, quarterYYYYQ, ifStale);

    return jobService.runAsJob(job);
  }

  @Operation(summary = "Launch Job to Update Course Data using Quarter")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/launch/updateQuarterCourses")
  public Job launchUpdateCourseDataWithQuarterJob(
      @Parameter(name = "quarterYYYYQ", description = "quarter (YYYYQ format)") @RequestParam
          String quarterYYYYQ,
      @Parameter(
              name = "ifStale",
              description = "true if job should only update when data is stale")
          @RequestParam(defaultValue = "true")
          Boolean ifStale) {

    var job = updateCourseDataJobFactory.createForQuarter(quarterYYYYQ, ifStale);

    return jobService.runAsJob(job);
  }

  @Operation(summary = "Launch Job to Update Course Data for range of quarters")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/launch/updateCoursesRangeOfQuarters")
  public Job launchUpdateCourseDataRangeOfQuartersJob(
      @Parameter(name = "start_quarterYYYYQ", description = "start quarter (YYYYQ format)")
          @RequestParam
          String start_quarterYYYYQ,
      @Parameter(name = "end_quarterYYYYQ", description = "end quarter (YYYYQ format)")
          @RequestParam
          String end_quarterYYYYQ,
      @Parameter(
              name = "ifStale",
              description = "true if job should only update when data is stale")
          @RequestParam(defaultValue = "true")
          Boolean ifStale) {

    var job =
        updateCourseDataJobFactory.createForQuarterRange(
            start_quarterYYYYQ, end_quarterYYYYQ, ifStale);

    return jobService.runAsJob(job);
  }

  @Operation(
      summary = "Launch Job to Update Course Data for a range of quarters for a single subject")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/launch/updateCoursesRangeOfQuartersSingleSubject")
  public Job launchUpdateCourseDataRangeOfQuartersSingleSubjectJob(
      @Parameter(name = "subjectArea", description = "subject area") @RequestParam
          String subjectArea,
      @Parameter(name = "start_quarterYYYYQ", description = "start quarter (YYYYQ format)")
          @RequestParam
          String start_quarterYYYYQ,
      @Parameter(name = "end_quarterYYYYQ", description = "end quarter (YYYYQ format)")
          @RequestParam
          String end_quarterYYYYQ,
      @Parameter(
              name = "ifStale",
              description = "true if job should only update when data is stale")
          @RequestParam(defaultValue = "true")
          Boolean ifStale) {

    var job =
        updateCourseDataJobFactory.createForSubjectAndQuarterRange(
            subjectArea, start_quarterYYYYQ, end_quarterYYYYQ, ifStale);

    return jobService.runAsJob(job);
  }

  @Operation(summary = "Launch Job to update grade history")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/launch/uploadGradeData")
  public Job launchUploadGradeData() {
    UploadGradeDataJob updateGradeDataJob = updateGradeDataJobFactory.create();
    return jobService.runAsJob(updateGradeDataJob);
  }

  @Operation(summary = "Launch Test Job (a job that sleeps, logs, and optionally fails)")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/launch/testjob")
  public Job launchTestJob(
      @Parameter(name = "fail") @RequestParam Boolean fail,
      @Parameter(name = "sleepMs") @RequestParam Integer sleepMs) {
    TestJob testJob = TestJob.builder().fail(fail).sleepMs(sleepMs).build();
    return jobService.runAsJob(testJob);
  }
}
