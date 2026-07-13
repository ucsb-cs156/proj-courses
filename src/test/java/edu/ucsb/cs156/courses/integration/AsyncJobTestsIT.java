package edu.ucsb.cs156.courses.integration;

import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.ucsb.cs156.courses.jobs.ScheduledJobs;
import edu.ucsb.cs156.courses.testconfig.TestJob;
import edu.ucsb.cs156.jobs.entities.Job;
import edu.ucsb.cs156.jobs.repositories.JobsRepository;
import edu.ucsb.cs156.jobs.services.JobContextFactory;
import edu.ucsb.cs156.jobs.services.JobService;
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
    // status is "queued" until the executor actually picks the job up (see
    // lib-jobs JobService.runJobAsync); it moves to "running" and then
    // "complete" asynchronously, so only the final state is deterministic.
    assertEquals("queued", job.getStatus(), "Job should be queued immediately after launch");
    await()
        .atMost(10, TimeUnit.SECONDS)
        .untilAsserted(() -> assertEquals("complete", job.getStatus(), "Job should be complete"));
  }
}
