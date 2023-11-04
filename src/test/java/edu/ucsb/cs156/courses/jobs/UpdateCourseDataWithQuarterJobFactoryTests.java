package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.UCSBSubjectsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@RestClientTest(UpdateCourseDataWithQuarterJobFactory.class)
@AutoConfigureDataJpa
public class UpdateCourseDataWithQuarterJobFactoryTests {

  @MockBean UCSBSubjectsService ucsbSubjectsService;

  @MockBean UCSBCurriculumService ucsbCurriculumService;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @Autowired UpdateCourseDataWithQuarterJobFactory updateCourseDataWithQuarterJobFactory;

  @Test
  void test_create() throws Exception {

    // Act

    UpdateCourseDataWithQuarterJob updateCourseDataWithQuarterJob =
        updateCourseDataWithQuarterJobFactory.create("20212");

    // Assert

    assertEquals("20212", updateCourseDataWithQuarterJob.getQuarterYYYYQ());
    assertEquals(ucsbSubjectsService, updateCourseDataWithQuarterJob.getUcsbSubjectService());
    assertEquals(ucsbCurriculumService, updateCourseDataWithQuarterJob.getUcsbCurriculumService());
    assertEquals(
        convertedSectionCollection, updateCourseDataWithQuarterJob.getConvertedSectionCollection());
  }
}
