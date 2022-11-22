package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.List;

import org.h2.command.dml.Update;
import org.hibernate.boot.jaxb.hbm.spi.SubEntityInfo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CoursePage;
import edu.ucsb.cs156.courses.documents.CoursePageFixtures;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.testconfig.TestConfig;


@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class UpdateCourseDataJobTests {

    @Mock
    UCSBCurriculumService ucsbCurriculumService;

    @Test
    void test_log_output() throws Exception {

        // Arrange

        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
        CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

        List<ConvertedSection> result = coursePage.convertedSections();

        UpdateCourseDataJob updateCourseDataJob = new UpdateCourseDataJob("CMPSC", "20211", ucsbCurriculumService);

        when(ucsbCurriculumService.getConvertedSections(eq("CMPSC"), eq("20211"), eq("A"))).thenReturn(result);


        // Act

        updateCourseDataJob.accept(ctx);

        // Assert

        String expected = """
                Updating courses for [CMPSC 20211]
                Found 14 sections
                This is where the code to store that data in MongoDB would go
                Courses for [CMPSC 20211] have been updated""";

        assertEquals(expected, jobStarted.getLog());
    }
}