package edu.ucsb.cs156.courses.jobs;

import static org.mockito.Mockito.verify;

import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;
import edu.ucsb.cs156.courses.services.GradeHistoryImportServiceImpl;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@RestClientTest(UploadGradeDataJob.class)
public class UploadGradeDataJobTests {

  @MockitoBean GradeHistoryRepository gradeHistoryRepository;

  @MockitoBean GradeHistoryImportServiceImpl gradeHistoryImportServiceImpl;

  @MockitoBean JobContext jobContext;

  @Test
  void test_uploadGradeData() throws Exception {

    // Arrange
    UploadGradeDataJob job =
        new UploadGradeDataJob(gradeHistoryRepository, gradeHistoryImportServiceImpl);

    // Act
    job.accept(jobContext);

    // Assert
    verify(jobContext).log("Updating UCSB Grade History Data");
    verify(gradeHistoryImportServiceImpl)
        .importGradesFromUrl(
            "https://raw.githubusercontent.com/dailynexusdata/grades-data/refs/heads/main/courseGrades.csv",
            jobContext,
            1000);
    verify(jobContext).log("Finished updating UCSB Grade History Data");
  }
}
