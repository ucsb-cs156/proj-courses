package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CoursePage;
import edu.ucsb.cs156.courses.documents.CoursePageFixtures;
import edu.ucsb.cs156.courses.documents.Section;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class UpdateCourseDataJobTests {

    @Mock
    UCSBCurriculumService ucsbCurriculumService;

    @Mock
    ConvertedSectionCollection convertedSectionCollection;

    @Test
    void test_log_output_success() throws Exception {

        // Arrange

        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
        CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

        List<ConvertedSection> result = coursePage.convertedSections();

        UpdateCourseDataJob updateCourseDataJob = new UpdateCourseDataJob("CMPSC", "20211", ucsbCurriculumService,
                convertedSectionCollection);

        when(ucsbCurriculumService.getConvertedSections(eq("CMPSC"), eq("20211"), eq("A"))).thenReturn(result);
        when(convertedSectionCollection.saveAll(any())).thenReturn(result);

        // Act

        updateCourseDataJob.accept(ctx);

        // Assert

        String expected = """
                Updating courses for [CMPSC 20211]
                Found 14 sections
                Storing in MongoDB Collection...
                14 new sections saved, 0 sections updated, 0 errors
                Courses for [CMPSC 20211] have been updated""";

        assertEquals(expected, jobStarted.getLog());
    }

    @Test
    void test_log_output_with_updates() throws Exception {

        // Arrange

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

        UpdateCourseDataJob updateCourseDataJob = new UpdateCourseDataJob("MATH", "20211", ucsbCurriculumService,
                convertedSectionCollection);

        Optional<ConvertedSection> section0Optional = Optional.of(section0);
        Optional<ConvertedSection> emptyOptional = Optional.empty();

        when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20211"), eq("A")))
                .thenReturn(listWithTwoOrigOneDuplicate);
        when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
                eq(section0.getCourseInfo().getQuarter()),
                eq(section0.getSection().getEnrollCode())))
                .thenReturn(emptyOptional).thenReturn(section0Optional);
        when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
                eq(section1.getCourseInfo().getQuarter()),
                eq(section1.getSection().getEnrollCode())))
                .thenReturn(emptyOptional);
        when(convertedSectionCollection.saveAll(any())).thenReturn(null);

        // Act

        updateCourseDataJob.accept(ctx);

        // Assert

        String expected = """
                Updating courses for [MATH 20211]
                Found 3 sections
                Storing in MongoDB Collection...
                2 new sections saved, 1 sections updated, 0 errors
                Courses for [MATH 20211] have been updated""";

        assertEquals(expected, jobStarted.getLog());
    }

    @Test
    void test_log_output_with_errors() throws Exception {

        // Arrange

        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
        CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

        List<ConvertedSection> convertedSections = coursePage.convertedSections();

        List<ConvertedSection> listWithOneSection = new ArrayList<>();

        ConvertedSection section0 = convertedSections.get(0);

        listWithOneSection.add(section0);

        UpdateCourseDataJob updateCourseDataJob = new UpdateCourseDataJob("MATH", "20211", ucsbCurriculumService,
                convertedSectionCollection);

        Optional<ConvertedSection> section0Optional = Optional.of(section0);
        Optional<ConvertedSection> emptyOptional = Optional.empty();

        when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20211"), eq("A")))
                .thenReturn(listWithOneSection);
        when(convertedSectionCollection.findOneByQuarterAndEnrollCode(
                eq(section0.getCourseInfo().getQuarter()),
                eq(section0.getSection().getEnrollCode())))
                .thenThrow(new IllegalArgumentException("Testing Exception Handling!"));

        // Act

        updateCourseDataJob.accept(ctx);

        // Assert

        String expected = """
                Updating courses for [MATH 20211]
                Found 1 sections
                Storing in MongoDB Collection...
                Error saving section: Testing Exception Handling!
                0 new sections saved, 0 sections updated, 1 errors
                Courses for [MATH 20211] have been updated""";

        assertEquals(expected, jobStarted.getLog());
    }

    @Test
    void test_updating_to_new_values() throws Exception {

        // Arrange

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

        UpdateCourseDataJob updateCourseDataJob = new UpdateCourseDataJob("MATH", "20211", ucsbCurriculumService,
                convertedSectionCollection);

        Optional<ConvertedSection> section0Optional = Optional.of(section0);

        when(ucsbCurriculumService.getConvertedSections(eq("MATH"), eq("20211"), eq("A")))
                .thenReturn(listWithUpdatedSection);
        when(convertedSectionCollection.findOneByQuarterAndEnrollCode(eq(quarter), eq(enrollCode)))
                .thenReturn(section0Optional);

        // Act

        updateCourseDataJob.accept(ctx);

        // Assert

        String expected = """
                Updating courses for [MATH 20211]
                Found 1 sections
                Storing in MongoDB Collection...
                0 new sections saved, 1 sections updated, 0 errors
                Courses for [MATH 20211] have been updated""";

         assertEquals(expected, jobStarted.getLog());

       verify(convertedSectionCollection, times(1)).findOneByQuarterAndEnrollCode(eq(quarter), eq(enrollCode));
       verify(convertedSectionCollection, times(1)).save(updatedSection);

    }

}