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

}
