package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.services.jobs.JobContext;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;


@ExtendWith(SpringExtension.class)
@ContextConfiguration 
public class TestJobTests {

    @Test
    void test_log_output_with_no_user() throws Exception {

        // Arrange

        Job jobStarted = Job.builder().build();

        JobContext ctx = new JobContext(null, jobStarted);

        // Act
        TestJob testJob = TestJob.builder()
                .sleepMs(0)
                .fail(false)
                .build();
        testJob.accept(ctx);

        String expected = """
            Hello World! from test job!
            authentication is null
            Goodbye from test job!""";
        // Assert
        assertEquals(expected, jobStarted.getLog());
    }

    @Test
    @WithMockUser(roles = { "ADMIN" })
    void test_log_output_with_mock_user() throws Exception {
        // Arrange

        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        // Act
        TestJob testJob = TestJob.builder()
                .sleepMs(0)
                .fail(false)
                .build();
        testJob.accept(ctx);

        String expected = """
                Hello World! from test job!
                authentication is not null
                Goodbye from test job!""";
        // Assert
        assertEquals(expected, jobStarted.getLog());
    }
}