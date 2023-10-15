package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.jobs.*;
import edu.ucsb.cs156.courses.repositories.JobsRepository;
import edu.ucsb.cs156.courses.services.jobs.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@Tag(name = "Jobs")
@RequestMapping("/api/jobs")
@RestController
public class JobsController extends ApiController {
    @Autowired
    private JobsRepository jobsRepository;

    @Autowired
    private ConvertedSectionCollection convertedSectionCollection;

    @Autowired
    private JobService jobService;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    UpdateCourseDataJobFactory updateCourseDataJobFactory;

    @Autowired
    UpdateCourseDataWithQuarterJobFactory updateCourseDataWithQuarterJobFactory;

    @Autowired
    UpdateCourseDataRangeOfQuartersJobFactory updateCourseDataRangeOfQuartersJobFactory;

    @Autowired
    UpdateCourseDataRangeOfQuartersSingleSubjectJobFactory updateCourseDataRangeOfQuartersSingleSubjectJobFactory;

    @Autowired
    UploadGradeDataJobFactory updateGradeDataJobFactory;

    @Operation(summary = "List all jobs")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public Iterable<Job> allJobs() {
        Iterable<Job> jobs = jobsRepository.findAll();
        return jobs;
    }

    @Operation(summary = "Launch Test Job (click fail if you want to test exception handling)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/testjob")
    public Job launchTestJob(
        @Parameter(name = "fail") @RequestParam Boolean fail,
        @Parameter(name = "sleepMs") @RequestParam Integer sleepMs
    ) {

        TestJob testJob = TestJob.builder()
            .fail(fail)
            .sleepMs(sleepMs)
            .build();
        return jobService.runAsJob(testJob);
    }

    @Operation(summary = "Launch Job to Update Course Data")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/updateCourses")
    public Job launchUpdateCourseDataJob(
        @Parameter(name = "quarterYYYYQ", description = "quarter (YYYYQ format)") @RequestParam String quarterYYYYQ,
        @Parameter(name = "subject area") @RequestParam String subjectArea
    ) {

        UpdateCourseDataJob updateCourseDataJob = updateCourseDataJobFactory.create(
            subjectArea,
            quarterYYYYQ);

        return jobService.runAsJob(updateCourseDataJob);
    }

    @Operation(summary = "Launch Job to Update Course Data using Quarter")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/updateQuarterCourses")
    public Job launchUpdateCourseDataWithQuarterJob(
        @Parameter(name = "quarterYYYYQ", description = "quarter (YYYYQ format)") @RequestParam String quarterYYYYQ
    ) {

        UpdateCourseDataWithQuarterJob updateCourseDataWithQuarterJob = updateCourseDataWithQuarterJobFactory.create(
            quarterYYYYQ);

        return jobService.runAsJob(updateCourseDataWithQuarterJob);
    }


    @Operation(summary = "Launch Job to Update Course Data for range of quarters")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/updateCoursesRangeOfQuarters")
    public Job launchUpdateCourseDataRangeOfQuartersJob(
        @Parameter(name = "start_quarterYYYYQ", description = "start quarter (YYYYQ format)") @RequestParam String start_quarterYYYYQ,
        @Parameter(name = "end_quarterYYYYQ", description = "end quarter (YYYYQ format)") @RequestParam String end_quarterYYYYQ
    ) {

        UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob = updateCourseDataRangeOfQuartersJobFactory.create(
            start_quarterYYYYQ, end_quarterYYYYQ);

        return jobService.runAsJob(updateCourseDataRangeOfQuartersJob);
    }

    @Operation(summary = "Launch Job to Update Course Data for a range of quarters for a single subject")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/updateCoursesRangeOfQuartersSingleSubject")
    public Job launchUpdateCourseDataRangeOfQuartersSingleSubjectJob(
        @Parameter(name = "subjectArea", description = "subject area") @RequestParam String subjectArea,
        @Parameter(name = "start_quarterYYYYQ", description = "start quarter (YYYYQ format)") @RequestParam String start_quarterYYYYQ,
        @Parameter(name = "end_quarterYYYYQ", description = "end quarter (YYYYQ format)") @RequestParam String end_quarterYYYYQ
    ) {

        UpdateCourseDataRangeOfQuartersSingleSubjectJob updateCourseDataRangeOfQuartersSingleSubjectJob =
            updateCourseDataRangeOfQuartersSingleSubjectJobFactory.create(
                subjectArea, start_quarterYYYYQ, end_quarterYYYYQ);

        return jobService.runAsJob(updateCourseDataRangeOfQuartersSingleSubjectJob);
    }

    @Operation(summary = "Launch Job to update grade history")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/uploadGradeData")
    public Job launchUploadGradeData() {
        UploadGradeDataJob updateGradeDataJob = updateGradeDataJobFactory.create();
        return jobService.runAsJob(updateGradeDataJob);
    }

}
