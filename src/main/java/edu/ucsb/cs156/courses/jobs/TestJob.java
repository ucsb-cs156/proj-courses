package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.jobs.services.JobContext;
import edu.ucsb.cs156.jobs.services.JobContextConsumer;
import lombok.Builder;

/**
 * A trivial job for testing the jobs infrastructure from the admin console: logs a line, sleeps,
 * then either fails or logs a goodbye. The admin frontend already has a form wired up to launch
 * this (TestJobForm/SingleButtonJobForm), but this app had no backend endpoint to receive it.
 */
@Builder
public class TestJob implements JobContextConsumer {

  private boolean fail;
  private int sleepMs;

  @Override
  public void accept(JobContext ctx) throws Exception {
    ctx.log("Hello World! from test job!");
    Thread.sleep(sleepMs);
    if (fail) {
      throw new Exception("Fail!");
    }
    ctx.log("Goodbye from test job!");
  }
}
