package edu.ucsb.cs156.courses.startup;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.jobs.UpdateCourseDataJob;
import edu.ucsb.cs156.courses.jobs.UpdateCourseDataJobFactory;
import edu.ucsb.cs156.courses.services.UCSBAPIQuarterService;
import edu.ucsb.cs156.courses.services.UCSBSubjectsService;
import edu.ucsb.cs156.courses.services.jobs.JobService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class CoursesStartupTests {

  @Mock UCSBAPIQuarterService ucsbAPIQuarterService;

  @Mock UCSBSubjectsService ucsbSubjectsService;

  @Mock UpdateCourseDataJobFactory updateCourseDataJobFactory;

  @Mock JobService jobService;

  @Mock UpdateCourseDataJob updateCourseDataJob;

  @Test
  public void alwaysRunOnStartup_validStartAndEnd_runsStartup() throws Exception {
    CoursesStartup coursesStartup = coursesStartupWithQuarters("20221", "20223");

    when(updateCourseDataJobFactory.createForSubjectAndQuarterRange(
            "CMPSC", "20221", "20223", true))
        .thenReturn(updateCourseDataJob);

    coursesStartup.alwaysRunOnStartup();

    verify(ucsbSubjectsService).loadAllSubjects();
    verify(ucsbAPIQuarterService).loadAllQuarters();
    verify(updateCourseDataJobFactory)
        .createForSubjectAndQuarterRange("CMPSC", "20221", "20223", true);
    verify(jobService).runAsJob(updateCourseDataJob);
  }

  @Test
  public void alwaysRunOnStartup_invalidStartQtr_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithQuarters("2022", "20223");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "START_QTR", "2022");
    verifyNoStartupDependenciesCalled();
  }

  @Test
  public void alwaysRunOnStartup_invalidEndQtr_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithQuarters("20221", "20220");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "END_QTR", "20220");
    verifyNoStartupDependenciesCalled();
  }

  @Test
  public void alwaysRunOnStartup_invalidQuarterDigit_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithQuarters("20225", "20223");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "START_QTR", "20225");
    verifyNoStartupDependenciesCalled();
  }

  @Test
  public void alwaysRunOnStartup_yearBelow1980_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithQuarters("19794", "20223");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "START_QTR", "19794");
    verifyNoStartupDependenciesCalled();
  }

  @Test
  public void alwaysRunOnStartup_yearAbove2050_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithQuarters("20514", "20223");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "START_QTR", "20514");
    verifyNoStartupDependenciesCalled();
  }

  @Test
  public void alwaysRunOnStartup_malformedNonNumeric_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithQuarters("abcde", "20223");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "START_QTR", "abcde");
    verifyNoStartupDependenciesCalled();
  }

  private CoursesStartup coursesStartupWithQuarters(String startQtrYYYYQ, String endQtrYYYYQ) {
    CoursesStartup coursesStartup = new CoursesStartup();

    coursesStartup.ucsbAPIQuarterService = ucsbAPIQuarterService;
    coursesStartup.ucsbSubjectsService = ucsbSubjectsService;
    ReflectionTestUtils.setField(
        coursesStartup, "updateCourseDataJobFactory", updateCourseDataJobFactory);
    ReflectionTestUtils.setField(coursesStartup, "jobService", jobService);
    ReflectionTestUtils.setField(coursesStartup, "startQtrYYYYQ", startQtrYYYYQ);
    ReflectionTestUtils.setField(coursesStartup, "endQtrYYYYQ", endQtrYYYYQ);

    return coursesStartup;
  }

  private void assertValidationFailure(
      RuntimeException exception, CapturedOutput output, String envVarName, String invalidValue) {
    String message = exception.getMessage();

    assertTrue(message.contains(envVarName));
    assertTrue(message.contains(invalidValue));
    assertTrue(message.contains("YYYYQ"));
    assertTrue(message.contains("1980-2050"));
    assertTrue(message.contains("1, 2, 3, or 4"));
    assertTrue(message.contains("20221"));
    assertTrue(output.getAll().contains(message));
  }

  private void verifyNoStartupDependenciesCalled() {
    verifyNoInteractions(
        ucsbSubjectsService, ucsbAPIQuarterService, updateCourseDataJobFactory, jobService);
  }
}
