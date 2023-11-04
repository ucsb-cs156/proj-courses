package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;

// import org.springframework.context.annotation.Import;

@RestClientTest(UpdateCourseDataRangeOfQuartersSingleSubjectJobFactory.class)
@AutoConfigureDataJpa
public class UpdateCourseDataRangeOfQuartersSingleSubjectJobFactoryTests {

  @MockBean UCSBCurriculumService ucsbCurriculumService;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @Autowired
  UpdateCourseDataRangeOfQuartersSingleSubjectJobFactory
      updateCourseDataRangeOfQuartersSingleSubjectJobFactory;

  @Test
  void test_create() throws Exception {

    // Act

    UpdateCourseDataRangeOfQuartersSingleSubjectJob
        updateCourseDataRangeOfQuartersSingleSubjectJob =
            updateCourseDataRangeOfQuartersSingleSubjectJobFactory.create(
                "CMPSC", "20221", "20222");

    // Assert

    assertEquals("CMPSC", updateCourseDataRangeOfQuartersSingleSubjectJob.getSubjectArea());
    assertEquals("20221", updateCourseDataRangeOfQuartersSingleSubjectJob.getStart_quarterYYYYQ());
    assertEquals("20222", updateCourseDataRangeOfQuartersSingleSubjectJob.getEnd_quarterYYYYQ());
    assertEquals(
        ucsbCurriculumService,
        updateCourseDataRangeOfQuartersSingleSubjectJob.getUcsbCurriculumService());
    assertEquals(
        convertedSectionCollection,
        updateCourseDataRangeOfQuartersSingleSubjectJob.getConvertedSectionCollection());
  }
}
