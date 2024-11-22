package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.collections.UpdateCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CoursePage;
import edu.ucsb.cs156.courses.documents.CoursePageFixtures;
import edu.ucsb.cs156.courses.documents.Update;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.services.IsStaleService;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UpdateCourseDataJobTests {
  @Mock UCSBCurriculumService ucsbCurriculumService;

  @Mock ConvertedSectionCollection convertedSectionCollection;

  @Mock UpdateCollection updateCollection;

  @Mock IsStaleService isStaleService;

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
                .build());
    doNothing().when(job).updateCourses(any(), any(), any());

    job.accept(ctx);

    verify(job).updateCourses(ctx, "20211", "CMPSC");
    verify(job).updateCourses(ctx, "20212", "CMPSC");
    verify(job).updateCourses(ctx, "20213", "CMPSC");

    verify(job).updateCourses(ctx, "20211", "MATH");
    verify(job).updateCourses(ctx, "20212", "MATH");
    verify(job).updateCourses(ctx, "20213", "MATH");
  }

  @Test
  void test_log_output_success() throws Exception {

    // Arrange

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> result = coursePage.convertedSections();

    when(ucsbCurriculumService.getConvertedSections(eq("CMPSC"), eq("20211"), eq("A")))
        .thenReturn(result);

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
            false);
    job.accept(ctx);

    // Assert
    String expected =
        """
                Updating courses for [CMPSC 20211]
                14 new sections saved, 0 sections updated, 0 errors, last update: 2022-03-05T15:50:10
                Saved update: Update(_id=null, subjectArea=CMPSC, quarter=20211, saved=14, updated=0, errors=0, lastUpdate=2022-03-05T15:50:10)""";

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
            false);
    job.accept(ctx);

    // Assert
    String expected =
        """
                Updating courses for [MATH 20211]
                2 new sections saved, 1 sections updated, 0 errors, last update: 2022-03-05T15:50:10
                Saved update: Update(_id=null, subjectArea=MATH, quarter=20211, saved=2, updated=1, errors=0, lastUpdate=2022-03-05T15:50:10)""";

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
            false);
    job.accept(ctx);

    // Assert
    String expected =
        """
                Updating courses for [MATH 20211]
                0 new sections saved, 0 sections updated, 1 errors, last update: 2022-03-05T15:50:10
                Saved update: Update(_id=null, subjectArea=MATH, quarter=20211, saved=0, updated=0, errors=1, lastUpdate=2022-03-05T15:50:10)""";

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
            false);
    job.accept(ctx);

    // Assert
    String expected =
        """
                Updating courses for [MATH 20211]
                0 new sections saved, 1 sections updated, 0 errors, last update: 2022-03-05T15:50:10
                Saved update: Update(_id=null, subjectArea=MATH, quarter=20211, saved=0, updated=1, errors=1, lastUpdate=2022-03-05T15:50:10)""";

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
            true);
    job.accept(ctx);

    // Assert
    String expected =
        """
                Updating courses for [MATH 20211]
                0 new sections saved, 1 sections updated, 0 errors, last update: 2022-03-05T15:50:10
                Saved update: Update(_id=null, subjectArea=MATH, quarter=20211, saved=0, updated=1, errors=1, lastUpdate=2022-03-05T15:50:10)""";

    assertEquals(expected, jobStarted.getLog());

    verify(convertedSectionCollection, times(1))
        .findOneByQuarterAndEnrollCode(eq(quarter), eq(enrollCode));
    verify(convertedSectionCollection, times(1)).save(updatedSection);
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
            true);
    job.accept(ctx);
  }
}
