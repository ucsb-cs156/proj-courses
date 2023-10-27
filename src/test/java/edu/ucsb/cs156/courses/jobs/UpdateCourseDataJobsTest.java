package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.services.CourseDataService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class UpdateCourseDataJobsTest {

    @Mock
    CourseDataService courseDataService;

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

    @Test
    void test_updateCourseData() throws Exception {
        var job = new UpdateCourseDataJob(
            "20211",
            "20213",
            List.of("CMPSC", "MATH"),
            courseDataService
        );
        job.accept(ctx);

        verify(courseDataService).updateCourses(ctx, "20211", "CMPSC");
        verify(courseDataService).updateCourses(ctx, "20212", "CMPSC");
        verify(courseDataService).updateCourses(ctx, "20213", "CMPSC");

        verify(courseDataService).updateCourses(ctx, "20211", "MATH");
        verify(courseDataService).updateCourses(ctx, "20212", "MATH");
        verify(courseDataService).updateCourses(ctx, "20213", "MATH");
    }
}
