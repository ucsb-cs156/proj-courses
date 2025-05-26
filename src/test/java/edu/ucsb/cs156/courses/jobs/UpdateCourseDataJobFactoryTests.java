package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.collections.UpdateCollection;
import edu.ucsb.cs156.courses.entities.UCSBSubject;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.courses.services.IsStaleService;
import edu.ucsb.cs156.courses.services.UCSBAPIQuarterService;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobRateLimit;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest(classes = UpdateCourseDataJobFactory.class)
public class UpdateCourseDataJobFactoryTests {

  @MockBean UCSBCurriculumService ucsbCurriculumService;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @MockBean UCSBSubjectRepository ucsbSubjectRepository;

  @MockBean UpdateCollection updateCollection;

  @MockBean IsStaleService isStaleService;

  @Autowired UpdateCourseDataJobFactory factory;

  @MockBean EnrollmentDataPointRepository enrollmentDataPointRepository;

  @MockBean UCSBAPIQuarterService ucsbapiQuarterService;

  @MockBean JobRateLimit jobRateLimit;

  @Test
  void test_createForSubjectAndQuarterAndIfStale() {

    // Act
    UpdateCourseDataJob job = factory.createForSubjectAndQuarterAndIfStale("CMPSC", "20211", true);

    // Assert
    assertEquals(List.of("CMPSC"), job.getSubjects());
    assertEquals("20211", job.getStart_quarterYYYYQ());
    assertEquals("20211", job.getEnd_quarterYYYYQ());
    assertTrue(job.isIfStale());
  }

  @Test
  void test_createForSubjectAndQuarterRange() {

    // Act
    UpdateCourseDataJob job =
        factory.createForSubjectAndQuarterRange("CMPSC", "20211", "20213", true);

    // Assert
    assertEquals(List.of("CMPSC"), job.getSubjects());
    assertEquals("20211", job.getStart_quarterYYYYQ());
    assertEquals("20213", job.getEnd_quarterYYYYQ());
  }

  @Test
  void test_createForQuarter() {

    // Act
    var subjectCodes = List.of("ANTH", "ART CS", "CH E");
    var subjects =
        subjectCodes.stream()
            .map(subjectName -> UCSBSubject.builder().subjectCode(subjectName).build())
            .toList();

    when(ucsbSubjectRepository.findAll()).thenReturn(subjects);

    UpdateCourseDataJob job = factory.createForQuarter("20211", false);

    // Assert

    assertEquals("20211", job.getStart_quarterYYYYQ());
    assertEquals("20211", job.getEnd_quarterYYYYQ());
    assertEquals(subjectCodes, job.getSubjects());
  }

  @Test
  void test_createForQuarterRange() {

    // arrange
    var subjectCodes = List.of("ANTH", "ART CS", "CH E");
    var subjects =
        subjectCodes.stream()
            .map(subjectName -> UCSBSubject.builder().subjectCode(subjectName).build())
            .toList();

    // Act

    when(ucsbSubjectRepository.findAll()).thenReturn(subjects);

    UpdateCourseDataJob job = factory.createForQuarterRange("20221", "20222", false);

    // Assert
    assertEquals("20221", job.getStart_quarterYYYYQ());
    assertEquals("20222", job.getEnd_quarterYYYYQ());
    assertEquals(subjectCodes, job.getSubjects());
  }
}
