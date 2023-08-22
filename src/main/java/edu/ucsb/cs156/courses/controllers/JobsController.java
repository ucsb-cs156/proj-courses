package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.jobs.UpdateCourseDataJob;
import edu.ucsb.cs156.courses.jobs.UpdateCourseDataJobFactory;
import edu.ucsb.cs156.courses.jobs.UpdateCourseDataRangeOfQuartersSingleSubjectJob;

import edu.ucsb.cs156.courses.jobs.UpdateCourseDataRangeOfQuartersSingleSubjectJobFactory;
import edu.ucsb.cs156.courses.jobs.UpdateCourseDataRangeOfQuartersJob;

import edu.ucsb.cs156.courses.jobs.UpdateCourseDataRangeOfQuartersJobFactory;

import edu.ucsb.cs156.courses.jobs.UpdateCourseDataWithQuarterJob;
import edu.ucsb.cs156.courses.jobs.UpdateCourseDataWithQuarterJobFactory;
import edu.ucsb.cs156.courses.jobs.UploadGradeDataJob;
import edu.ucsb.cs156.courses.jobs.UploadGradeDataJobFactory;
import edu.ucsb.cs156.courses.jobs.TestJob;
import edu.ucsb.cs156.courses.repositories.JobsRepository;
import edu.ucsb.cs156.courses.services.jobs.JobService;


@Api(description = "Jobs")
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

    @ApiOperation(value = "List all jobs")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public Iterable<Job> allJobs() {
        Iterable<Job> jobs = jobsRepository.findAll();
        return jobs;
    }

    @ApiOperation(value = "Launch Test Job (click fail if you want to test exception handling)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/testjob")
    public Job launchTestJob(
        @ApiParam("fail") @RequestParam Boolean fail, 
        @ApiParam("sleepMs") @RequestParam Integer sleepMs
    ) {

        TestJob testJob = TestJob.builder()
        .fail(fail)
        .sleepMs(sleepMs)
        .build();
        return jobService.runAsJob(testJob);
    }
    
    @ApiOperation(value = "Launch Job to Update Course Data")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/updateCourses")
    public Job launchUpdateCourseDataJob(
        @ApiParam("quarter (YYYYQ format)") @RequestParam String quarterYYYYQ,
        @ApiParam("subject area") @RequestParam String subjectArea
    ) {
       
        UpdateCourseDataJob updateCourseDataJob = updateCourseDataJobFactory.create(
            subjectArea,
            quarterYYYYQ);

        return jobService.runAsJob(updateCourseDataJob);
    }

    @ApiOperation(value = "Launch Job to Update Course Data using Quarter")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/updateQuarterCourses")
    public Job launchUpdateCourseDataWithQuarterJob(
        @ApiParam("quarter (YYYYQ format)") @RequestParam String quarterYYYYQ
    ) {
       
        UpdateCourseDataWithQuarterJob updateCourseDataWithQuarterJob = updateCourseDataWithQuarterJobFactory.create(
            quarterYYYYQ);

        return jobService.runAsJob(updateCourseDataWithQuarterJob);
    }


    @ApiOperation(value = "Launch Job to Update Course Data for range of quarters")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/updateCoursesRangeOfQuarters")
    public Job launchUpdateCourseDataRangeOfQuartersJob(
        @ApiParam("quarter (YYYYQ format)") @RequestParam String start_quarterYYYYQ,
        @ApiParam("quarter (YYYYQ format)") @RequestParam String end_quarterYYYYQ
    ) {
       
        UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob = updateCourseDataRangeOfQuartersJobFactory.create(
            start_quarterYYYYQ, end_quarterYYYYQ);

        return jobService.runAsJob(updateCourseDataRangeOfQuartersJob);
    }

    @ApiOperation(value = "Launch Job to Update Course Data for a range of quarters for a single subject")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/updateCoursesRangeOfQuartersSingleSubject")
    public Job launchUpdateCourseDataRangeOfQuartersSingleSubjectJob(
        @ApiParam("subject area") @RequestParam String subjectArea,
        @ApiParam("quarter (YYYYQ format)") @RequestParam String start_quarterYYYYQ,
        @ApiParam("quarter (YYYYQ format)") @RequestParam String end_quarterYYYYQ
    ) {
       
        UpdateCourseDataRangeOfQuartersSingleSubjectJob updateCourseDataRangeOfQuartersSingleSubjectJob = 
        updateCourseDataRangeOfQuartersSingleSubjectJobFactory.create(
            subjectArea, start_quarterYYYYQ, end_quarterYYYYQ);

        return jobService.runAsJob(updateCourseDataRangeOfQuartersSingleSubjectJob);
    }
    
    @ApiOperation(value = "Launch Job to update grade history")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/uploadGradeData")
    public Job launchUploadGradeData() {
        UploadGradeDataJob updateGradeDataJob = updateGradeDataJobFactory.create();
        return jobService.runAsJob(updateGradeDataJob);
    }

}
