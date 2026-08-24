package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.collections.UpdateCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CoursePage;
import edu.ucsb.cs156.courses.documents.CoursePageFixtures;
import edu.ucsb.cs156.courses.documents.Update;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import edu.ucsb.cs156.courses.services.IsStaleService;
import edu.ucsb.cs156.courses.services.UCSBAPIQuarterService;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.jobs.entities.Job;
import edu.ucsb.cs156.jobs.errors.JobCancelledException;
import edu.ucsb.cs156.jobs.repositories.JobsRepository;
import edu.ucsb.cs156.jobs.services.JobContext;
import edu.ucsb.cs156.jobs.services.JobRateLimit;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.test.context.TestPropertySource;

@ExtendWith(MockitoExtension.class)
@EnableConfigurationProperties(value = JobRateLimit.class)
@TestPropertySource("classpath:application.properties")
public class UpdateCourseDataJobTests {
  @Mock UCSBCurriculumService ucsbCurriculumService;

  @Mock ConvertedSectionCollection convertedSectionCollection;

  @Mock UpdateCollection updateCollection;

  @Mock IsStaleService isStaleService;

  @Mock EnrollmentDataPointRepository enrollmentDataPointRepository;

  @Mock UCSBAPIQuarterService ucsbapiQuarterService;

  @Mock JobRateLimit jobRateLimit;

  Job jobStarted = Job.builder().build();
  JobContext ctx = new JobContext(null, jobStarted);

  @Test
  void test_subject_and_quarter_range() throws Exception {
    var job =
        spy(
            UpdateCourseDataJob.builder()
                .start_quarterYYYYQ("20211")
                .end_quarterYYYYQ("20213")
                .subjects(List.of("CMPSC", "MATH"))
                .ucsbCurriculumService(ucsbCurriculumService)
                .convertedSectionCollection(convertedSectionCollection)
                .updateCollection(updateCollection)
                .isStaleService(isStaleService)
                .ifStale(false)
                .enrollmentDataPointRepository(enrollmentDataPointRepository)
                .ucsbapiQuarterService(ucsbapiQuarterService)
                .jobRateLimit(jobRateLimit)
                .build());
    doNothing().when(job).updateCourses(any(), any(), any());

    job.accept(ctx);

    verify(job).updateCourses(ctx, "20211", "CMPSC");
    verify(job).updateCourses(ctx, "20212", "CMPSC");
    verify(job).updateCourses(ctx, "20213", "CMPSC");

    verify(job).updateCourses(ctx, "20211", "MATH");
    verify(job).updateCourses(ctx, "20212", "MATH");
    verify(job).updateCourses(ctx, "20213", "MATH");
    verify(jobRateLimit, atLeastOnce()).sleep();
  }

  @Test
  void test_log_output_success() throws Exception {

    // Arrange

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> result = coursePage.convertedSections();

    when(ucsbCurriculumService.getConvertedSections(eq("CMPSC"), eq("20211"), eq("A")))
        .thenReturn(result);

    when(ucsbapiQuarterService.isQuarterInRegistrationPass(anyString())).thenReturn(false);

    LocalDateTime someTime = LocalDateTime.parse("2022-03-05T15:50:10");
    Update update = new Update(null, "CMPSC", "20211", 14, 0, 0, someTime);
    when(updateCollection.save(any())).thenReturn(update);

    // Act
    var job =
        new UpdateCourseDataJob(
            "20211",
            "20211",
            List.of("CMPSC"),
            ucsbCurriculumService,
            convertedSectionCollection,
            updateCollection,
            isStaleService,
            false,
            enrollmentDataPointRepository,
            ucsbapiQuarterService,
            jobRateLimit);
    job.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses from 20211 to 20211 for 1 subjects
                Updating courses for [CMPSC 20211]
                14 new sections saved, 0 sections updated, 0 errors, last update: 2022-03-05T15:50:10
                Saved update: Update(_id=null, subjectArea=CMPSC, quarter=20211, saved=14, updated=0, errors=0, lastUpdate=2022-03-05T15:50:10)
                Finished updating courses""";

    assertEquals(expected, jobStarted.getLog());
  }

  @Test
  void test_log_output_with_updates() throws Exception {

    // Arrange

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> convertedSections = coursePage.convertedSections();

    List<ConvertedSection> listWithTwoOrigOneDuplicate = new ArrayList<>();

    ConvertedSection section0 = convertedSections.get(0);
    ConvertedSection section1 = convertedSections.get(1);

    listWithTwoOrigOneDuplicate.add(section0);
    listWithTwoOrigOneDuplicate.add(section1);
    listWithTwoOrigOneDuplicate.add(section0);

    Optional<ConvertedSection> section0Optional = Optional.of(section0);
    Optional<ConvertedSection> emptyOptional = Optional.empty();

    when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20211"), eq("A")))
        .thenReturn(listWithTwoOrigOneDuplicate);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section0.getCourseInfo().getQuarter()), eq(section0.getSection().getEnrollCode())))
        .thenReturn(emptyOptional)
        .thenReturn(section0Optional);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section1.getCourseInfo().getQuarter()), eq(section1.getSection().getEnrollCode())))
        .thenReturn(emptyOptional);
    when(ucsbapiQuarterService.isQuarterInRegistrationPass(anyString())).thenReturn(false);

    LocalDateTime someTime = LocalDateTime.parse("2022-03-05T15:50:10");
    Update update = new Update(null, "MATH", "20211", 2, 1, 0, someTime);
    when(updateCollection.save(any())).thenReturn(update);

    // Act
    var job =
        new UpdateCourseDataJob(
            "20211",
            "20211",
            List.of("MATH"),
            ucsbCurriculumService,
            convertedSectionCollection,
            updateCollection,
            isStaleService,
            false,
            enrollmentDataPointRepository,
            ucsbapiQuarterService,
            jobRateLimit);
    job.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses from 20211 to 20211 for 1 subjects
                Updating courses for [MATH 20211]
                2 new sections saved, 1 sections updated, 0 errors, last update: 2022-03-05T15:50:10
                Saved update: Update(_id=null, subjectArea=MATH, quarter=20211, saved=2, updated=1, errors=0, lastUpdate=2022-03-05T15:50:10)
                Finished updating courses""";

    assertEquals(expected, jobStarted.getLog());
  }

  @Test
  void test_log_output_with_errors() throws Exception {

    // Arrange

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> convertedSections = coursePage.convertedSections();

    List<ConvertedSection> listWithOneSection = new ArrayList<>();

    ConvertedSection section0 = convertedSections.get(0);

    listWithOneSection.add(section0);

    Optional<ConvertedSection> section0Optional = Optional.of(section0);
    Optional<ConvertedSection> emptyOptional = Optional.empty();

    when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20211"), eq("A")))
        .thenReturn(listWithOneSection);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section0.getCourseInfo().getQuarter()), eq(section0.getSection().getEnrollCode())))
        .thenThrow(new IllegalArgumentException("Testing Exception Handling!"));
    when(ucsbapiQuarterService.isQuarterInRegistrationPass(anyString())).thenReturn(false);

    LocalDateTime someTime = LocalDateTime.parse("2022-03-05T15:50:10");
    Update update = new Update(null, "MATH", "20211", 0, 0, 1, someTime);
    when(updateCollection.save(any())).thenReturn(update);

    // Act
    var job =
        new UpdateCourseDataJob(
            "20211",
            "20211",
            List.of("MATH"),
            ucsbCurriculumService,
            convertedSectionCollection,
            updateCollection,
            isStaleService,
            false,
            enrollmentDataPointRepository,
            ucsbapiQuarterService,
            jobRateLimit);
    job.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses from 20211 to 20211 for 1 subjects
                Updating courses for [MATH 20211]
                0 new sections saved, 0 sections updated, 1 errors, last update: 2022-03-05T15:50:10
                Saved update: Update(_id=null, subjectArea=MATH, quarter=20211, saved=0, updated=0, errors=1, lastUpdate=2022-03-05T15:50:10)
                Finished updating courses""";

    assertEquals(expected, jobStarted.getLog());
  }

  @Test
  void test_updating_to_new_values() throws Exception {

    // Arrange

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> convertedSections = coursePage.convertedSections();

    List<ConvertedSection> listWithUpdatedSection = new ArrayList<>();

    ConvertedSection section0 = convertedSections.get(0);
    String quarter = section0.getCourseInfo().getQuarter();
    String enrollCode = section0.getSection().getEnrollCode();

    int oldEnrollment = section0.getSection().getEnrolledTotal();

    ConvertedSection updatedSection = (ConvertedSection) section0.clone();
    updatedSection.getCourseInfo().setTitle("New Title");
    updatedSection.getSection().setEnrolledTotal(oldEnrollment + 1);
    listWithUpdatedSection.add(updatedSection);

    Optional<ConvertedSection> section0Optional = Optional.of(section0);

    when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20211"), eq("A")))
        .thenReturn(listWithUpdatedSection);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(eq(quarter), eq(enrollCode)))
        .thenReturn(section0Optional);
    when(ucsbapiQuarterService.isQuarterInRegistrationPass(anyString())).thenReturn(false);

    LocalDateTime someTime = LocalDateTime.parse("2022-03-05T15:50:10");
    Update update = new Update(null, "MATH", "20211", 0, 1, 1, someTime);
    when(updateCollection.save(any())).thenReturn(update);

    // Act
    var job =
        new UpdateCourseDataJob(
            "20211",
            "20211",
            List.of("MATH"),
            ucsbCurriculumService,
            convertedSectionCollection,
            updateCollection,
            isStaleService,
            false,
            enrollmentDataPointRepository,
            ucsbapiQuarterService,
            jobRateLimit);
    job.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses from 20211 to 20211 for 1 subjects
                Updating courses for [MATH 20211]
                0 new sections saved, 1 sections updated, 0 errors, last update: 2022-03-05T15:50:10
                Saved update: Update(_id=null, subjectArea=MATH, quarter=20211, saved=0, updated=1, errors=1, lastUpdate=2022-03-05T15:50:10)
                Finished updating courses""";

    assertEquals(expected, jobStarted.getLog());

    verify(convertedSectionCollection, times(1))
        .findOneByQuarterAndEnrollCode(eq(quarter), eq(enrollCode));
    verify(convertedSectionCollection, times(1)).save(updatedSection);
  }

  @Test
  void test_if_stale_and_is_stale() throws Exception {

    // Arrange

    when(isStaleService.isStale(eq("MATH"), eq("20211"))).thenReturn(true);

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> convertedSections = coursePage.convertedSections();

    List<ConvertedSection> listWithUpdatedSection = new ArrayList<>();

    ConvertedSection section0 = convertedSections.get(0);
    String quarter = section0.getCourseInfo().getQuarter();
    String enrollCode = section0.getSection().getEnrollCode();

    int oldEnrollment = section0.getSection().getEnrolledTotal();

    ConvertedSection updatedSection = (ConvertedSection) section0.clone();
    updatedSection.getCourseInfo().setTitle("New Title");
    updatedSection.getSection().setEnrolledTotal(oldEnrollment + 1);
    listWithUpdatedSection.add(updatedSection);

    Optional<ConvertedSection> section0Optional = Optional.of(section0);

    when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20211"), eq("A")))
        .thenReturn(listWithUpdatedSection);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(eq(quarter), eq(enrollCode)))
        .thenReturn(section0Optional);
    when(ucsbapiQuarterService.isQuarterInRegistrationPass(eq("20211"))).thenReturn(true);

    LocalDateTime someTime = LocalDateTime.parse("2022-03-05T15:50:10");
    Update update = new Update(null, "MATH", "20211", 0, 1, 1, someTime);
    when(updateCollection.save(any())).thenReturn(update);

    EnrollmentDataPoint edp = updatedSection.getEnrollmentDataPoint();
    when(enrollmentDataPointRepository.save(eq(edp))).thenReturn(edp);

    // Act
    var job =
        new UpdateCourseDataJob(
            "20211",
            "20211",
            List.of("MATH"),
            ucsbCurriculumService,
            convertedSectionCollection,
            updateCollection,
            isStaleService,
            true,
            enrollmentDataPointRepository,
            ucsbapiQuarterService,
            jobRateLimit);
    job.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses from 20211 to 20211 for 1 subjects
                Updating courses for [MATH 20211]
                0 new sections saved, 1 sections updated, 0 errors, last update: 2022-03-05T15:50:10
                Saved update: Update(_id=null, subjectArea=MATH, quarter=20211, saved=0, updated=1, errors=1, lastUpdate=2022-03-05T15:50:10)
                Finished updating courses""";

    assertEquals(expected, jobStarted.getLog());

    verify(convertedSectionCollection, times(1))
        .findOneByQuarterAndEnrollCode(eq(quarter), eq(enrollCode));
    verify(convertedSectionCollection, times(1)).save(updatedSection);
    verify(enrollmentDataPointRepository, times(1)).save(eq(edp));
  }

  @Test
  void test_if_stale_and_is_not_stale() throws Exception {

    // Arrange

    when(isStaleService.isStale(eq("MATH"), eq("20211"))).thenReturn(false);

    // Act
    var job =
        new UpdateCourseDataJob(
            "20211",
            "20211",
            List.of("MATH"),
            ucsbCurriculumService,
            convertedSectionCollection,
            updateCollection,
            isStaleService,
            true,
            enrollmentDataPointRepository,
            ucsbapiQuarterService,
            jobRateLimit);
    job.accept(ctx);
  }

  // ────────────────────── checkCancellation checkpoints ──────────────────────
  // On a typical re-run, most (subjectArea, quarterYYYYQ) pairs are not stale and hit `continue`
  // with no ctx.log() call at all, and the convertedSections loop never calls ctx.log() at any
  // point (only after the whole loop finishes). Without their own ctx.checkCancellation()
  // checkpoints, cancellation could sit unactioned through both loops no matter how many pairs
  // or sections they process. These tests mock a JobsRepository that reports "running" for
  // exactly the calls known to precede the checkpoint under test, then "cancelling" from then on,
  // and assert both that JobCancelledException is thrown AND that a specific downstream call the
  // checkpoint should have pre-empted was never made -- the second assertion is what actually
  // distinguishes the real code from a mutant that removes the checkpoint, since removing one
  // checkpoint just shifts the exception to whatever checkpoint comes next.

  private static Job runningJob() {
    return Job.builder().id(99L).status("running").build();
  }

  private static Job cancellingJob() {
    return Job.builder().id(99L).status("cancelling").build();
  }

  @Test
  void checkCancellation_stops_the_subject_loop_before_checking_staleness() throws Exception {
    JobsRepository jobsRepository = mock(JobsRepository.class);
    // 1 real checkpoint precedes the outer loop's own check: accept()'s opening "Updating
    // courses..." log line.
    when(jobsRepository.findById(99L))
        .thenReturn(Optional.of(runningJob()), Optional.of(cancellingJob()));
    Job job = Job.builder().id(99L).build();
    JobContext cancellingCtx = new JobContext(null, job, null, jobsRepository);

    var updateCourseDataJob =
        UpdateCourseDataJob.builder()
            .start_quarterYYYYQ("20211")
            .end_quarterYYYYQ("20211")
            .subjects(List.of("CMPSC"))
            .ucsbCurriculumService(ucsbCurriculumService)
            .convertedSectionCollection(convertedSectionCollection)
            .updateCollection(updateCollection)
            .isStaleService(isStaleService)
            .ifStale(false)
            .enrollmentDataPointRepository(enrollmentDataPointRepository)
            .ucsbapiQuarterService(ucsbapiQuarterService)
            .jobRateLimit(jobRateLimit)
            .build();

    assertThrows(JobCancelledException.class, () -> updateCourseDataJob.accept(cancellingCtx));

    verify(isStaleService, never()).isStale(any(), any());
    verify(ucsbCurriculumService, never()).getConvertedSections(any(), any(), any());
  }

  @Test
  void checkCancellation_stops_the_sections_loop_before_saving_the_first_section()
      throws Exception {
    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);
    List<ConvertedSection> result = coursePage.convertedSections();
    when(ucsbCurriculumService.getConvertedSections(eq("CMPSC"), eq("20211"), eq("A")))
        .thenReturn(result);
    when(ucsbapiQuarterService.isQuarterInRegistrationPass(anyString())).thenReturn(false);

    JobsRepository jobsRepository = mock(JobsRepository.class);
    // 3 real checkpoints precede the sections loop's own check under this setup: accept()'s
    // opening log line, the outer subject-loop's own checkCancellation() (checked above), and
    // updateCourses' "Updating courses for [...]" log line.
    when(jobsRepository.findById(99L))
        .thenReturn(
            Optional.of(runningJob()),
            Optional.of(runningJob()),
            Optional.of(runningJob()),
            Optional.of(cancellingJob()));
    Job job = Job.builder().id(99L).build();
    JobContext cancellingCtx = new JobContext(null, job, null, jobsRepository);

    var updateCourseDataJob =
        UpdateCourseDataJob.builder()
            .start_quarterYYYYQ("20211")
            .end_quarterYYYYQ("20211")
            .subjects(List.of("CMPSC"))
            .ucsbCurriculumService(ucsbCurriculumService)
            .convertedSectionCollection(convertedSectionCollection)
            .updateCollection(updateCollection)
            .isStaleService(isStaleService)
            .ifStale(false)
            .enrollmentDataPointRepository(enrollmentDataPointRepository)
            .ucsbapiQuarterService(ucsbapiQuarterService)
            .jobRateLimit(jobRateLimit)
            .build();

    assertThrows(JobCancelledException.class, () -> updateCourseDataJob.accept(cancellingCtx));

    verify(convertedSectionCollection, never()).findOneByQuarterAndEnrollCode(any(), any());
  }
}
