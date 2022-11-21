package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.services.jobs.JobContext;

public class UpdateCourseDataJobTests {
    @Test
    void test_log_output() throws Exception {

        // Arrange

        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        // Act
        UpdateCourseDataJob updateCourseDataJob = UpdateCourseDataJob.builder()
                .quarterYYYYQ("20231")
                .subjectArea("CMPSC")
                .build();
        updateCourseDataJob.accept(ctx);

        // Assert

        String expected = """
                Updating courses for [CMPSC 20231]
                This is where the code to pull data from the UCSB API would go
                This is where the code to store that data in MongoDB would go
                Courses for [CMPSC 20231] have been updated""";

        assertEquals(expected, jobStarted.getLog());
    }
}