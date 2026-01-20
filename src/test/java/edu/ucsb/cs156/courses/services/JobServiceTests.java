package edu.ucsb.cs156.courses.services;

import static org.hamcrest.Matchers.samePropertyValuesAs;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.models.CurrentUser;
import edu.ucsb.cs156.courses.repositories.JobsRepository;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextFactory;
import edu.ucsb.cs156.courses.services.jobs.JobService;
import edu.ucsb.cs156.courses.testconfig.TestJob;
import java.util.List;
import java.util.Optional;
import org.hamcrest.MatcherAssert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class JobServiceTests {

  @Mock private JobsRepository jobRepository;

  @Mock private JobService injectedJobService;

  @Mock private JobContextFactory contextFactory;

  @Mock private CurrentUserService currentUserService;

  @InjectMocks private JobService jobService;

  private CurrentUser user;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);

    user =
        CurrentUser.builder()
            .roles(List.of(new SimpleGrantedAuthority("ROLE_ADMIN")))
            .user(User.builder().id(1L).build())
            .build();
  }

  @Test
  void test_getJobLogs_with_log() {
    // Arrange
    Long jobId = 1L;
    Job job = Job.builder().build();
    job.setLog("This is a job log");
    when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));

    // Act
    String result = jobService.getLongJob(jobId);

    // Assert
    assertEquals("This is a job log", result);
  }

  @Test
  void test_getJobLogs_with_null_log() {
    // Arrange
    Long jobId = 2L;
    Job job = Job.builder().build();
    job.setLog(null);
    when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));

    // Act
    String result = jobService.getLongJob(jobId);

    // Assert
    assertEquals("", result);
  }

  @Test
  void test_getJobLogs_job_not_found() {
    // Arrange
    Long jobId = 3L;
    when(jobRepository.findById(jobId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> jobService.getLongJob(jobId));
  }

  @Test
  void runAsJob_fires_correctly() {
    TestJob job = TestJob.builder().fail(false).sleepMs(0).build();

    Job fireJob = Job.builder().createdBy(user.getUser()).status("running").build();

    doNothing().when(injectedJobService).runJobAsync(any(), any());
    when(currentUserService.getUser()).thenReturn(user.getUser());

    MatcherAssert.assertThat(fireJob, samePropertyValuesAs(jobService.runAsJob(job)));
    verify(jobRepository).save(eq(fireJob));
    verify(injectedJobService).runJobAsync(eq(fireJob), eq(job));
  }

  @Test
  void runAsyncJob_fires_correctly() throws Exception {
    TestJob job = mock(TestJob.class);
    JobContext context = mock(JobContext.class);

    Job passedJob = Job.builder().status("running").build();
    Job expectedReturn = Job.builder().status("complete").build();

    doNothing().when(job).accept(any());

    when(contextFactory.createContext(eq(passedJob))).thenReturn(context);
    doNothing().when(job).accept(eq(context));

    jobService.runJobAsync(passedJob, job);
    verify(jobRepository).save(eq(expectedReturn));
    verify(job).accept(eq(context));
    verify(contextFactory).createContext(eq(passedJob));
  }

  @Test
  void runAsyncJob_handles_error() throws Exception {
    TestJob job = mock(TestJob.class);
    JobContext context = mock(JobContext.class);

    Job passedJob = Job.builder().status("running").build();
    doNothing().when(job).accept(any());

    when(contextFactory.createContext(eq(passedJob))).thenReturn(context);
    doThrow(new Exception("fail!")).when(job).accept(eq(context));

    jobService.runJobAsync(passedJob, job);
    verify(context).log(contains("fail!"));
    verify(job).accept(eq(context));
    verify(contextFactory).createContext(eq(passedJob));
    assertEquals("error", passedJob.getStatus());
  }
}
