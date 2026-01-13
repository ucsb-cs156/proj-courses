package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;
import edu.ucsb.cs156.courses.services.GradeHistoryImportServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@RestClientTest(UploadGradeDataJobFactory.class)
@AutoConfigureDataJpa
public class UploadGradeDataJobFactoryTests {

  @MockitoBean GradeHistoryRepository gradeHistoryRepository;

  @MockitoBean GradeHistoryImportServiceImpl gradeHistoryImportServiceImpl;

  @Autowired UploadGradeDataJobFactory uploadGradeDataJobFactory;

  @Test
  void test_create() throws Exception {

    // Act

    UploadGradeDataJob uploadGradeDataJob = uploadGradeDataJobFactory.create();

    // Assert

    assertEquals(gradeHistoryImportServiceImpl, uploadGradeDataJob.getGradeHistoryImportService());
    assertEquals(gradeHistoryRepository, uploadGradeDataJob.getGradeHistoryRepository());
  }
}
