package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.controllers.UCSBSubjectsController;
import edu.ucsb.cs156.courses.entities.UCSBSubject;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import java.util.ArrayList;
import java.util.Arrays;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@RestClientTest(UpdateCourseDataRangeOfQuartersJobFactory.class)
@AutoConfigureDataJpa
public class UpdateCourseDataRangeOfQuartersJobFactoryTests {

  @MockBean UCSBCurriculumService ucsbCurriculumService;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @MockBean UCSBSubjectsController subjectsController;

  @MockBean UCSBSubjectRepository ucsbSubjectRepository;

  @Autowired UpdateCourseDataRangeOfQuartersJobFactory updateCourseDataRangeOfQuartersJobFactory;

  @Test
  void test_create() throws Exception {

    // arrange

    UCSBSubject us1 =
        UCSBSubject.builder()
            .subjectCode("ANTH")
            .subjectTranslation("Anthropology")
            .deptCode("ANTH")
            .collegeCode("L&S")
            .relatedDeptCode(null)
            .inactive(false)
            .build();

    UCSBSubject us2 =
        UCSBSubject.builder()
            .subjectCode("ART  CS")
            .subjectTranslation("Art (Creative Studies)")
            .deptCode("CRSTU")
            .collegeCode("CRST")
            .relatedDeptCode(null)
            .inactive(false)
            .build();

    UCSBSubject us3 =
        UCSBSubject.builder()
            .subjectCode("CH E")
            .subjectTranslation("Chemical Engineering")
            .deptCode("CNENG")
            .collegeCode("ENGR")
            .relatedDeptCode(null)
            .inactive(false)
            .build();

    ArrayList<UCSBSubject> subjects = new ArrayList<>();
    subjects.addAll(Arrays.asList(us1, us2, us3));

    ArrayList<String> expectedSubjects = new ArrayList<>();

    for (UCSBSubject subject : subjects) {
      expectedSubjects.add(subject.getSubjectCode());
    }

    // Act

    when(ucsbSubjectRepository.findAll()).thenReturn(subjects);

    UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob =
        updateCourseDataRangeOfQuartersJobFactory.create("20221", "20222");

    // Assert

    assertEquals("20221", updateCourseDataRangeOfQuartersJob.getStart_quarterYYYYQ());
    assertEquals("20222", updateCourseDataRangeOfQuartersJob.getEnd_quarterYYYYQ());
    assertEquals(
        ucsbCurriculumService, updateCourseDataRangeOfQuartersJob.getUcsbCurriculumService());
    assertEquals(
        convertedSectionCollection,
        updateCourseDataRangeOfQuartersJob.getConvertedSectionCollection());
    assertEquals(expectedSubjects, updateCourseDataRangeOfQuartersJob.getSubjects());
  }
}
