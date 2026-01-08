package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.services.jobs.JobContext;

public interface GradeHistoryImportService {
  public void importGradesFromUrl(String url, JobContext ctx, int batchSize) throws Exception;
}
