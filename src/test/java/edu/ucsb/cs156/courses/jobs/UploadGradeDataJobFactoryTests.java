package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;
import edu.ucsb.cs156.courses.services.UCSBGradeHistoryServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@RestClientTest(UploadGradeDataJobFactory.class)
@AutoConfigureDataJpa
public class UploadGradeDataJobFactoryTests {

  @MockBean GradeHistoryRepository gradeHistoryRepository;

  @MockBean UCSBGradeHistoryServiceImpl ucsbGradeHistoryServiceImpl;

  @Autowired UploadGradeDataJobFactory UploadGradeDataJobFactory;

  @Test
  void test_create() throws Exception {

    // Act

    UploadGradeDataJob UploadGradeDataJob = UploadGradeDataJobFactory.create();

    // Assert

    assertEquals(ucsbGradeHistoryServiceImpl, UploadGradeDataJob.getUcsbGradeHistoryServiceImpl());
    assertEquals(gradeHistoryRepository, UploadGradeDataJob.getGradeHistoryRepository());
  }
}
