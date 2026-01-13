package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;
import edu.ucsb.cs156.courses.services.GradeHistoryImportService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public class UploadGradeDataJob implements JobContextConsumer {
  @Getter private GradeHistoryRepository gradeHistoryRepository;
  @Getter private GradeHistoryImportService gradeHistoryImportService;

  private static final int BATCH_SIZE = 1000;

  @Override
  public void accept(JobContext ctx) throws Exception {
    ctx.log("Updating UCSB Grade History Data");

    gradeHistoryImportService.importGradesFromUrl(
        "https://raw.githubusercontent.com/dailynexusdata/grades-data/refs/heads/main/courseGrades.csv",
        ctx,
        BATCH_SIZE);

    ctx.log("Finished updating UCSB Grade History Data");
  }
}
