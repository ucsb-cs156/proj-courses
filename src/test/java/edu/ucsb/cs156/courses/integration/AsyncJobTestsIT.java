package edu.ucsb.cs156.courses.integration;

import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import edu.ucsb.cs156.courses.jobs.ScheduledJobs;
import edu.ucsb.cs156.courses.testconfig.TestJob;
import edu.ucsb.cs156.jobs.entities.Job;
import edu.ucsb.cs156.jobs.services.JobContextFactory;
import edu.ucsb.cs156.jobs.services.JobService;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

/**
 * JobsRepository is deliberately NOT mocked here (unlike ScheduledJobs below): since v0.2.0,
 * ctx.log() writes real, foreign-key-constrained rows to job_logs referencing jobs.id, so the Job
 * this test launches needs a real, persisted id -- a mocked JobsRepository.save() would leave
 * job.getId() at Java's default 0, and job_logs' FK_JOB_LOGS_JOBS constraint would reject every log
 * line the job writes, permanently landing it in "error" status instead of "complete".
 */
@SpringBootTest
@ActiveProfiles("integration")
public class AsyncJobTestsIT {

  @Autowired private JobService jobService;

  @Autowired private JobContextFactory contextFactory;

  @MockitoBean private ScheduledJobs scheduledJobs;

  @Test
  void async_job_actually_runs_asynchronously() {
    TestJob testJob = TestJob.builder().fail(false).sleepMs(2000).build();
    Job job = jobService.runAsJob(testJob);
    // job is the same object reference JobService.runJobAsync mutates on its own thread (see
    // lib-jobs JobService), so asserting an exact "queued" status here is a race: a fast enough
    // executor can already have flipped it to "running" by this point. Only assert what actually
    // proves asynchronicity -- the job hasn't already finished synchronously.
    assertNotEquals(
        "complete", job.getStatus(), "Job should not be complete immediately after launch");
    await()
        .atMost(10, TimeUnit.SECONDS)
        .untilAsserted(() -> assertEquals("complete", job.getStatus(), "Job should be complete"));
  }
}
