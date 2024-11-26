package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.repositories.JobsRepository;
import edu.ucsb.cs156.courses.services.jobs.JobService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

public class LongJobServiceTests {

  @Mock private JobsRepository jobRepository;

  @InjectMocks private JobService jobService;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void test_getLongJob_with_log() {
    // Arrange
    Long jobId = 1L;
    Job job = Job.builder().build();
    // JobContext ctx = new JobContext(null, job);
    job.setLog("This is a job log");
    when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));

    // Act
    String result = jobService.getLongJob(jobId);

    // Assert
    assertEquals("This is a job log", result);
  }

  @Test
  void test_getLongJob_with_null_log() {
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
  void test_getLongJob_job_not_found() {
    // Arrange
    Long jobId = 3L;
    when(jobRepository.findById(jobId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> jobService.getLongJob(jobId));
  }
}
