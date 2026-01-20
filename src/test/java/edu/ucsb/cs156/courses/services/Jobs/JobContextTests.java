package edu.ucsb.cs156.courses.services.Jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.repositories.JobsRepository;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import org.junit.jupiter.api.Test;
import org.mockito.InOrder;
import org.mockito.Mockito;

public class JobContextTests {
  @Test
  public void when_jobs_repository_is_null_does_not_save() throws Exception {

    // arrange

    Job job1 = Job.builder().build();
    JobContext ctx = new JobContext(null, job1);

    // act
    ctx.log("This is a log message");

    // assert
    assertEquals("This is a log message", job1.getLog());
  }

  @Test
  public void jobsContext_can_save_log_messages() throws Exception {
    JobsRepository repository = mock(JobsRepository.class);
    Job job = Job.builder().build();
    Job jobAfterFirstSave = Job.builder().log("This is a log message").build();
    Job jobAfterSecondSave = Job.builder().log("This is a log message\nSecond log message").build();

    JobContext ctx = new JobContext(repository, job);

    InOrder inOrder = Mockito.inOrder(repository);

    ctx.log("This is a log message");
    assertEquals("This is a log message", job.getLog());

    inOrder.verify(repository).save(jobAfterFirstSave);

    ctx.log("Second log message");
    assertEquals("This is a log message\nSecond log message", job.getLog());

    inOrder.verify(repository).save(jobAfterSecondSave);
    inOrder.verifyNoMoreInteractions();
  }
}
