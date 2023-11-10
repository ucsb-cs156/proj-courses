package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CoursePage;
import edu.ucsb.cs156.courses.documents.CoursePageFixtures;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class UpdateCourseDataRangeOfQuartersJobTests {

  @Mock UCSBCurriculumService ucsbCurriculumService;

  @Mock ConvertedSectionCollection convertedSectionCollection;

  @Mock List<String> subjects;

  @Test
  void test_log_output_success() throws Exception {

    // Arrange

    subjects = new ArrayList<String>();
    subjects.add("CMPSC");
    subjects.add("MATH");
    subjects.add("ANTH");

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> result = coursePage.convertedSections();

    UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob =
        new UpdateCourseDataRangeOfQuartersJob(
            "20221", "20222", ucsbCurriculumService, convertedSectionCollection, subjects);

    when(ucsbCurriculumService.getConvertedSections(eq("CMPSC"), eq("20221"), eq("A")))
        .thenReturn(result);
    when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20221"), eq("A")))
        .thenReturn(result);
    when(ucsbCurriculumService.getConvertedSections(eq("ANTH"), eq("20221"), eq("A")))
        .thenReturn(result);
    when(ucsbCurriculumService.getConvertedSections(eq("CMPSC"), eq("20222"), eq("A")))
        .thenReturn(result);
    when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20222"), eq("A")))
        .thenReturn(result);
    when(ucsbCurriculumService.getConvertedSections(eq("ANTH"), eq("20222"), eq("A")))
        .thenReturn(result);
    when(convertedSectionCollection.saveAll(any())).thenReturn(result);

    // Act

    updateCourseDataRangeOfQuartersJob.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses for [CMPSC 20221]
                Found 14 sections
                Storing in MongoDB Collection...
                14 new sections saved, 0 sections updated, 0 errors
                Courses for [CMPSC 20221] have been updated
                Updating courses for [MATH 20221]
                Found 14 sections
                Storing in MongoDB Collection...
                14 new sections saved, 0 sections updated, 0 errors
                Courses for [MATH 20221] have been updated
                Updating courses for [ANTH 20221]
                Found 14 sections
                Storing in MongoDB Collection...
                14 new sections saved, 0 sections updated, 0 errors
                Courses for [ANTH 20221] have been updated
                Updating courses for [CMPSC 20222]
                Found 14 sections
                Storing in MongoDB Collection...
                14 new sections saved, 0 sections updated, 0 errors
                Courses for [CMPSC 20222] have been updated
                Updating courses for [MATH 20222]
                Found 14 sections
                Storing in MongoDB Collection...
                14 new sections saved, 0 sections updated, 0 errors
                Courses for [MATH 20222] have been updated
                Updating courses for [ANTH 20222]
                Found 14 sections
                Storing in MongoDB Collection...
                14 new sections saved, 0 sections updated, 0 errors
                Courses for [ANTH 20222] have been updated""";

    assertEquals(expected, jobStarted.getLog());
    // assertEquals(subjects,updateCourseDataRangeOfQuartersJob.getSubjects());

  }

  @Test
  void test_log_output_with_updates() throws Exception {

    // Arrange

    subjects = new ArrayList<String>();
    subjects.add("ANTH");

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> convertedSections = coursePage.convertedSections();

    List<ConvertedSection> listWithTwoOrigOneDuplicate = new ArrayList<>();

    ConvertedSection section0 = convertedSections.get(0);
    ConvertedSection section1 = convertedSections.get(1);

    listWithTwoOrigOneDuplicate.add(section0);
    listWithTwoOrigOneDuplicate.add(section1);
    listWithTwoOrigOneDuplicate.add(section0);

    UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob =
        new UpdateCourseDataRangeOfQuartersJob(
            "20221", "20222", ucsbCurriculumService, convertedSectionCollection, subjects);

    Optional<ConvertedSection> section0Optional = Optional.of(section0);
    Optional<ConvertedSection> emptyOptional = Optional.empty();

    when(ucsbCurriculumService.getConvertedSections(eq("ANTH"), eq("20221"), eq("A")))
        .thenReturn(listWithTwoOrigOneDuplicate);

    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section0.getCourseInfo().getQuarter()), eq(section0.getSection().getEnrollCode())))
        .thenReturn(emptyOptional)
        .thenReturn(section0Optional);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section1.getCourseInfo().getQuarter()), eq(section1.getSection().getEnrollCode())))
        .thenReturn(emptyOptional);
    when(convertedSectionCollection.saveAll(any())).thenReturn(null);

    // Act

    updateCourseDataRangeOfQuartersJob.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses for [ANTH 20221]
                Found 3 sections
                Storing in MongoDB Collection...
                2 new sections saved, 1 sections updated, 0 errors
                Courses for [ANTH 20221] have been updated
                Updating courses for [ANTH 20222]
                Found 0 sections
                Storing in MongoDB Collection...
                0 new sections saved, 0 sections updated, 0 errors
                Courses for [ANTH 20222] have been updated""";

    assertEquals(expected, jobStarted.getLog());
  }

  @Test
  void test_log_output_with_updates_same_year_same_quarter() throws Exception {

    // Arrange

    subjects = new ArrayList<String>();
    subjects.add("ANTH");

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> convertedSections = coursePage.convertedSections();

    List<ConvertedSection> listWithTwoOrigOneDuplicate = new ArrayList<>();

    ConvertedSection section0 = convertedSections.get(0);
    ConvertedSection section1 = convertedSections.get(1);

    listWithTwoOrigOneDuplicate.add(section0);
    listWithTwoOrigOneDuplicate.add(section1);
    listWithTwoOrigOneDuplicate.add(section0);

    UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob =
        new UpdateCourseDataRangeOfQuartersJob(
            "20221", "20221", ucsbCurriculumService, convertedSectionCollection, subjects);

    Optional<ConvertedSection> section0Optional = Optional.of(section0);
    Optional<ConvertedSection> emptyOptional = Optional.empty();

    when(ucsbCurriculumService.getConvertedSections(eq("ANTH"), eq("20221"), eq("A")))
        .thenReturn(listWithTwoOrigOneDuplicate);

    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section0.getCourseInfo().getQuarter()), eq(section0.getSection().getEnrollCode())))
        .thenReturn(emptyOptional)
        .thenReturn(section0Optional);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section1.getCourseInfo().getQuarter()), eq(section1.getSection().getEnrollCode())))
        .thenReturn(emptyOptional);
    when(convertedSectionCollection.saveAll(any())).thenReturn(null);

    // Act

    updateCourseDataRangeOfQuartersJob.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses for [ANTH 20221]
                Found 3 sections
                Storing in MongoDB Collection...
                2 new sections saved, 1 sections updated, 0 errors
                Courses for [ANTH 20221] have been updated""";

    assertEquals(expected, jobStarted.getLog());
  }

  @Test
  void test_log_output_with_updates_same_year_start_bigger_than_end() throws Exception {

    // Arrange

    subjects = new ArrayList<String>();
    subjects.add("ANTH");

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> convertedSections = coursePage.convertedSections();

    List<ConvertedSection> listWithTwoOrigOneDuplicate = new ArrayList<>();

    ConvertedSection section0 = convertedSections.get(0);
    ConvertedSection section1 = convertedSections.get(1);

    listWithTwoOrigOneDuplicate.add(section0);
    listWithTwoOrigOneDuplicate.add(section1);
    listWithTwoOrigOneDuplicate.add(section0);

    UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob =
        new UpdateCourseDataRangeOfQuartersJob(
            "20222", "20221", ucsbCurriculumService, convertedSectionCollection, subjects);

    Optional<ConvertedSection> section0Optional = Optional.of(section0);
    Optional<ConvertedSection> emptyOptional = Optional.empty();

    when(ucsbCurriculumService.getConvertedSections(eq("ANTH"), eq("20221"), eq("A")))
        .thenReturn(listWithTwoOrigOneDuplicate);

    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section0.getCourseInfo().getQuarter()), eq(section0.getSection().getEnrollCode())))
        .thenReturn(emptyOptional)
        .thenReturn(section0Optional);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section1.getCourseInfo().getQuarter()), eq(section1.getSection().getEnrollCode())))
        .thenReturn(emptyOptional);
    when(convertedSectionCollection.saveAll(any())).thenReturn(null);

    // Act

    updateCourseDataRangeOfQuartersJob.accept(ctx);

    // Assert

    String expected =
        """
        Updating courses for [ANTH 20222]
        Found 0 sections
        Storing in MongoDB Collection...
        0 new sections saved, 0 sections updated, 0 errors
        Courses for [ANTH 20222] have been updated
        Updating courses for [ANTH 20221]
        Found 3 sections
        Storing in MongoDB Collection...
        2 new sections saved, 1 sections updated, 0 errors
        Courses for [ANTH 20221] have been updated""";

    assertEquals(expected, jobStarted.getLog());
  }

  @Test
  void test_log_output_with_updates_qtr_reset() throws Exception {

    // Arrange

    subjects = new ArrayList<String>();
    subjects.add("ANTH");

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> convertedSections = coursePage.convertedSections();

    List<ConvertedSection> listWithTwoOrigOneDuplicate = new ArrayList<>();

    ConvertedSection section0 = convertedSections.get(0);
    ConvertedSection section1 = convertedSections.get(1);

    listWithTwoOrigOneDuplicate.add(section0);
    listWithTwoOrigOneDuplicate.add(section1);
    listWithTwoOrigOneDuplicate.add(section0);

    UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob =
        new UpdateCourseDataRangeOfQuartersJob(
            "20224", "20231", ucsbCurriculumService, convertedSectionCollection, subjects);

    Optional<ConvertedSection> section0Optional = Optional.of(section0);
    Optional<ConvertedSection> emptyOptional = Optional.empty();

    when(ucsbCurriculumService.getConvertedSections(eq("ANTH"), eq("20224"), eq("A")))
        .thenReturn(listWithTwoOrigOneDuplicate);

    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section0.getCourseInfo().getQuarter()), eq(section0.getSection().getEnrollCode())))
        .thenReturn(emptyOptional)
        .thenReturn(section0Optional);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section1.getCourseInfo().getQuarter()), eq(section1.getSection().getEnrollCode())))
        .thenReturn(emptyOptional);
    when(convertedSectionCollection.saveAll(any())).thenReturn(null);

    // Act

    updateCourseDataRangeOfQuartersJob.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses for [ANTH 20224]
                Found 3 sections
                Storing in MongoDB Collection...
                2 new sections saved, 1 sections updated, 0 errors
                Courses for [ANTH 20224] have been updated
                Updating courses for [ANTH 20231]
                Found 0 sections
                Storing in MongoDB Collection...
                0 new sections saved, 0 sections updated, 0 errors
                Courses for [ANTH 20231] have been updated""";

    assertEquals(expected, jobStarted.getLog());
  }

  @Test
  void test_log_output_with_updates_year_flipped() throws Exception {

    // Arrange

    subjects = new ArrayList<String>();
    subjects.add("ANTH");

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> convertedSections = coursePage.convertedSections();

    List<ConvertedSection> listWithTwoOrigOneDuplicate = new ArrayList<>();

    ConvertedSection section0 = convertedSections.get(0);
    ConvertedSection section1 = convertedSections.get(1);

    listWithTwoOrigOneDuplicate.add(section0);
    listWithTwoOrigOneDuplicate.add(section1);
    listWithTwoOrigOneDuplicate.add(section0);

    UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob =
        new UpdateCourseDataRangeOfQuartersJob(
            "20222", "20211", ucsbCurriculumService, convertedSectionCollection, subjects);

    Optional<ConvertedSection> section0Optional = Optional.of(section0);
    Optional<ConvertedSection> emptyOptional = Optional.empty();

    when(ucsbCurriculumService.getConvertedSections(eq("ANTH"), eq("20211"), eq("A")))
        .thenReturn(listWithTwoOrigOneDuplicate);

    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section0.getCourseInfo().getQuarter()), eq(section0.getSection().getEnrollCode())))
        .thenReturn(emptyOptional)
        .thenReturn(section0Optional);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section1.getCourseInfo().getQuarter()), eq(section1.getSection().getEnrollCode())))
        .thenReturn(emptyOptional);
    when(convertedSectionCollection.saveAll(any())).thenReturn(null);

    // Act

    updateCourseDataRangeOfQuartersJob.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses for [ANTH 20222]
                Found 0 sections
                Storing in MongoDB Collection...
                0 new sections saved, 0 sections updated, 0 errors
                Courses for [ANTH 20222] have been updated
                Updating courses for [ANTH 20221]
                Found 0 sections
                Storing in MongoDB Collection...
                0 new sections saved, 0 sections updated, 0 errors
                Courses for [ANTH 20221] have been updated
                Updating courses for [ANTH 20214]
                Found 0 sections
                Storing in MongoDB Collection...
                0 new sections saved, 0 sections updated, 0 errors
                Courses for [ANTH 20214] have been updated
                Updating courses for [ANTH 20213]
                Found 0 sections
                Storing in MongoDB Collection...
                0 new sections saved, 0 sections updated, 0 errors
                Courses for [ANTH 20213] have been updated
                Updating courses for [ANTH 20212]
                Found 0 sections
                Storing in MongoDB Collection...
                0 new sections saved, 0 sections updated, 0 errors
                Courses for [ANTH 20212] have been updated
                Updating courses for [ANTH 20211]
                Found 3 sections
                Storing in MongoDB Collection...
                2 new sections saved, 1 sections updated, 0 errors
                Courses for [ANTH 20211] have been updated""";

    assertEquals(expected, jobStarted.getLog());
  }

  @Test
  void test_log_output_with_errors() throws Exception {

    // Arrange

    subjects = new ArrayList<String>();
    subjects.add("MATH");

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> convertedSections = coursePage.convertedSections();

    List<ConvertedSection> listWithOneSection = new ArrayList<>();

    ConvertedSection section0 = convertedSections.get(0);

    listWithOneSection.add(section0);

    UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob =
        new UpdateCourseDataRangeOfQuartersJob(
            "20221", "20222", ucsbCurriculumService, convertedSectionCollection, subjects);

    // Optional<ConvertedSection> section0Optional = Optional.of(section0);
    // Optional<ConvertedSection> emptyOptional = Optional.empty();

    when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20221"), eq("A")))
        .thenReturn(listWithOneSection);
    when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20222"), eq("A")))
        .thenReturn(listWithOneSection);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
            eq(section0.getCourseInfo().getQuarter()), eq(section0.getSection().getEnrollCode())))
        .thenThrow(new IllegalArgumentException("Testing Exception Handling!"));

    // Act

    updateCourseDataRangeOfQuartersJob.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses for [MATH 20221]
                Found 1 sections
                Storing in MongoDB Collection...
                Error saving section: Testing Exception Handling!
                0 new sections saved, 0 sections updated, 1 errors
                Courses for [MATH 20221] have been updated
                Updating courses for [MATH 20222]
                Found 1 sections
                Storing in MongoDB Collection...
                Error saving section: Testing Exception Handling!
                0 new sections saved, 0 sections updated, 1 errors
                Courses for [MATH 20222] have been updated""";

    assertEquals(expected, jobStarted.getLog());
  }

  @Test
  void test_updating_to_new_values() throws Exception {

    // Arrange

    subjects = new ArrayList<String>();
    subjects.add("MATH");

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

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

    UpdateCourseDataRangeOfQuartersJob updateCourseDataRangeOfQuartersJob =
        new UpdateCourseDataRangeOfQuartersJob(
            "20221", "20222", ucsbCurriculumService, convertedSectionCollection, subjects);

    Optional<ConvertedSection> section0Optional = Optional.of(section0);

    when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20221"), eq("A")))
        .thenReturn(listWithUpdatedSection);
    when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20222"), eq("A")))
        .thenReturn(listWithUpdatedSection);
    when(convertedSectionCollection.findOneByQuarterAndEnrollCode(eq(quarter), eq(enrollCode)))
        .thenReturn(section0Optional);

    // Act

    updateCourseDataRangeOfQuartersJob.accept(ctx);

    // Assert

    String expected =
        """
                Updating courses for [MATH 20221]
                Found 1 sections
                Storing in MongoDB Collection...
                0 new sections saved, 1 sections updated, 0 errors
                Courses for [MATH 20221] have been updated
                Updating courses for [MATH 20222]
                Found 1 sections
                Storing in MongoDB Collection...
                0 new sections saved, 1 sections updated, 0 errors
                Courses for [MATH 20222] have been updated""";

    assertEquals(expected, jobStarted.getLog());

    verify(convertedSectionCollection, times(2))
        .findOneByQuarterAndEnrollCode(eq(quarter), eq(enrollCode));
    verify(convertedSectionCollection, times(2)).save(updatedSection);
  }
}
