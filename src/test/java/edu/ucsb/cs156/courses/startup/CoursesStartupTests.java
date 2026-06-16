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
  public void alwaysRunOnStartup_validStart_usesComputedEndAndRunsStartup() throws Exception {
    CoursesStartup coursesStartup = coursesStartupWithStartQuarter("20221");

    when(ucsbAPIQuarterService.getEndQtrYYYYQ()).thenReturn("20223");
    when(updateCourseDataJobFactory.createForSubjectAndQuarterRange(
            "CMPSC", "20221", "20223", true))
        .thenReturn(updateCourseDataJob);

    coursesStartup.alwaysRunOnStartup();

    verify(ucsbSubjectsService).loadAllSubjects();
    verify(ucsbAPIQuarterService).getEndQtrYYYYQ();
    verify(ucsbAPIQuarterService).loadAllQuarters();
    verify(updateCourseDataJobFactory)
        .createForSubjectAndQuarterRange("CMPSC", "20221", "20223", true);
    verify(jobService).runAsJob(updateCourseDataJob);
  }

  @Test
  public void alwaysRunOnStartup_invalidStartQtr_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithStartQuarter("2022");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "START_QTR", "2022");
    verifyNoStartupDependenciesCalled();
  }

  @Test
  public void alwaysRunOnStartup_doesNotRequireManuallyConfiguredEndQtr() throws Exception {
    CoursesStartup coursesStartup = coursesStartupWithStartQuarter("20221");

    when(ucsbAPIQuarterService.getEndQtrYYYYQ()).thenReturn("20222");
    when(updateCourseDataJobFactory.createForSubjectAndQuarterRange(
            "CMPSC", "20221", "20222", true))
        .thenReturn(updateCourseDataJob);

    coursesStartup.alwaysRunOnStartup();

    verify(updateCourseDataJobFactory)
        .createForSubjectAndQuarterRange("CMPSC", "20221", "20222", true);
    verify(jobService).runAsJob(updateCourseDataJob);
  }

  @Test
  public void alwaysRunOnStartup_invalidQuarterDigit_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithStartQuarter("20225");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "START_QTR", "20225");
    verifyNoStartupDependenciesCalled();
  }

  @Test
  public void alwaysRunOnStartup_yearBelow1980_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithStartQuarter("19794");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "START_QTR", "19794");
    verifyNoStartupDependenciesCalled();
  }

  @Test
  public void alwaysRunOnStartup_yearAbove2050_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithStartQuarter("20514");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "START_QTR", "20514");
    verifyNoStartupDependenciesCalled();
  }

  @Test
  public void alwaysRunOnStartup_malformedNonNumeric_throwsAndLogs(CapturedOutput output) {
    CoursesStartup coursesStartup = coursesStartupWithStartQuarter("abcde");

    RuntimeException exception =
        assertThrows(RuntimeException.class, coursesStartup::alwaysRunOnStartup);

    assertValidationFailure(exception, output, "START_QTR", "abcde");
    verifyNoStartupDependenciesCalled();
  }

  @Test
  public void runOnStartupInProductionOnly_usesComputedEndQtr() throws Exception {
    CoursesStartup coursesStartup = coursesStartupWithStartQuarter("20221");

    when(ucsbAPIQuarterService.getEndQtrYYYYQ()).thenReturn("20224");
    when(updateCourseDataJobFactory.createForQuarterRange("20221", "20224", true))
        .thenReturn(updateCourseDataJob);

    coursesStartup.runOnStartupInProductionOnly();

    verify(ucsbAPIQuarterService).getEndQtrYYYYQ();
    verify(updateCourseDataJobFactory).createForQuarterRange("20221", "20224", true);
    verify(jobService).runAsJob(updateCourseDataJob);
  }

  private CoursesStartup coursesStartupWithStartQuarter(String startQtrYYYYQ) {
    CoursesStartup coursesStartup = new CoursesStartup();

    coursesStartup.ucsbAPIQuarterService = ucsbAPIQuarterService;
    coursesStartup.ucsbSubjectsService = ucsbSubjectsService;
    ReflectionTestUtils.setField(
        coursesStartup, "updateCourseDataJobFactory", updateCourseDataJobFactory);
    ReflectionTestUtils.setField(coursesStartup, "jobService", jobService);
    ReflectionTestUtils.setField(coursesStartup, "startQtrYYYYQ", startQtrYYYYQ);

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
