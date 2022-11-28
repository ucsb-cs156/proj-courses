package edu.ucsb.cs156.courses.services.jobs;

import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.repositories.JobsRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@Slf4j
public class JobContext {
  private JobsRepository jobsRepository;
  private Job job;

  public void log(String message) {
    log.info("Job %s: %s".formatted(job.getId(), message));
    String previousLog = job.getLog() == null ? "" : (job.getLog() + "\n");
    job.setLog(previousLog + message);
    if (jobsRepository!=null)
      jobsRepository.save(job);
  }
}
