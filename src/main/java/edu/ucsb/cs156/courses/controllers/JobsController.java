package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.errors.EntityNotFoundException;
import edu.ucsb.cs156.courses.jobs.TestJob;
import edu.ucsb.cs156.courses.jobs.UpdateCourseDataJobFactory;
import edu.ucsb.cs156.courses.jobs.UploadGradeDataJob;
import edu.ucsb.cs156.courses.jobs.UploadGradeDataJobFactory;
import edu.ucsb.cs156.courses.repositories.JobsRepository;
import edu.ucsb.cs156.courses.services.jobs.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.List;



@Tag(name = "Jobs")
@RequestMapping("/api/jobs")
@RestController
@Slf4j
public class JobsController extends ApiController {
  @Autowired private JobsRepository jobsRepository;

  @Autowired private ConvertedSectionCollection convertedSectionCollection;

  @Autowired private JobService jobService;

  @Autowired ObjectMapper mapper;

  @Autowired UpdateCourseDataJobFactory updateCourseDataJobFactory;

  @Autowired UploadGradeDataJobFactory updateGradeDataJobFactory;

  @Operation(summary = "List all jobs(Paged)")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping("/all")
  public Page<Job> allJobs(
    @RequestParam(defaultValue="0") int page,
    @RequestParam(defaultValue="10") int size,
    @RequestParam(defaultValue="createdAt") String sortField,
    @RequestParam(defaultValue="DESC") String sortDir
) {
    // only these fields are allowed for sorting
    List<String> allowed = List.of("id","createdAt","updatedAt","status");
    if (!allowed.contains(sortField)) {
        throw new IllegalArgumentException(sortField + " is not a valid sort field");
    }

    Sort.Direction dir = sortDir.equalsIgnoreCase("DESC")
        ? Sort.Direction.DESC
        : Sort.Direction.ASC;
    Pageable pageable = PageRequest.of(page, size, dir, sortField);

    return jobsRepository.findAll(pageable);
}

  @Operation(summary = "Delete all job records")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("/all")
  public Map<String, String> deleteAllJobs() {
    jobsRepository.deleteAll();
    return Map.of("message", "All jobs deleted");
  }

  @Operation(summary = "Get a specific Job Log by ID if it is in the database")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping("")
  public Job getJobLogById(
      @Parameter(name = "id", description = "ID of the job") @RequestParam Long id)
      throws JsonProcessingException {

    Job job =
        jobsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Job.class, id));

    return job;
  }

  @Operation(summary = "Delete specific job record")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("")
  public Map<String, String> deleteAllJobs(@Parameter(name = "id") @RequestParam Long id) {
    if (!jobsRepository.existsById(id)) {
      return Map.of("message", String.format("Job with id %d not found", id));
    }
    jobsRepository.deleteById(id);
    return Map.of("message", String.format("Job with id %d deleted", id));
  }

  @Operation(summary = "Launch Test Job (click fail if you want to test exception handling)")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/launch/testjob")
  public Job launchTestJob(
      @Parameter(name = "fail") @RequestParam Boolean fail,
      @Parameter(name = "sleepMs") @RequestParam Integer sleepMs) {

    TestJob testJob = TestJob.builder().fail(fail).sleepMs(sleepMs).build();
    return jobService.runAsJob(testJob);
  }

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

  @Operation(summary = "Get long job logs")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping("/logs/{id}")
  public String getJobLogs(@Parameter(name = "id", description = "Job ID") @PathVariable Long id) {

    return jobService.getLongJob(id);
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
}
