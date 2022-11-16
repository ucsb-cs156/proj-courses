package edu.ucsb.cs156.courses.services.jobs;

@FunctionalInterface
public interface JobContextConsumer {
  void accept(JobContext c) throws Exception;
}
