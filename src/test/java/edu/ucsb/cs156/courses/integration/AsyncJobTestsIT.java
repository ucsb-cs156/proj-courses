package edu.ucsb.cs156.courses.integration;

import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.jobs.ScheduledJobs;
import edu.ucsb.cs156.courses.repositories.JobsRepository;
import edu.ucsb.cs156.courses.services.jobs.JobContextFactory;
import edu.ucsb.cs156.courses.services.jobs.JobService;
import edu.ucsb.cs156.courses.testconfig.TestJob;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@ActiveProfiles("integration")
public class AsyncJobTestsIT {

  @Autowired private JobService jobService;

  @Autowired private JobContextFactory contextFactory;

  @MockitoBean private JobsRepository jobsRepository;

  @MockitoBean private ScheduledJobs scheduledJobs;

  @Test
  void async_job_actually_runs_asynchronously() {
    TestJob testJob = TestJob.builder().fail(false).sleepMs(2000).build();
    Job job = jobService.runAsJob(testJob);
    assertEquals("running", job.getStatus(), "Job should be running");
    await()
        .atMost(10, TimeUnit.SECONDS)
        .untilAsserted(() -> assertEquals("complete", job.getStatus(), "Job should be complete"));
  }
}
