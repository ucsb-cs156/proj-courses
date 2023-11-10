package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CoursePage;
import edu.ucsb.cs156.courses.documents.CoursePageFixtures;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class UpdateCourseDataRangeOfQuartersSingleSubjectJobTests {

  @Mock UCSBCurriculumService ucsbCurriculumService;

  @Mock ConvertedSectionCollection convertedSectionCollection;

  @Mock List<String> subjects;

  @Test
  void test_log_output_success() throws Exception {

    // Arrange

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

    String coursePageJson = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;
    CoursePage coursePage = CoursePage.fromJSON(coursePageJson);

    List<ConvertedSection> result = coursePage.convertedSections();

    UpdateCourseDataRangeOfQuartersSingleSubjectJob
        updateCourseDataRangeOfQuartersSingleSubjectJob =
            new UpdateCourseDataRangeOfQuartersSingleSubjectJob(
                "CMPSC", "20221", "20222", ucsbCurriculumService, convertedSectionCollection);

    when(ucsbCurriculumService.getConvertedSections(eq("CMPSC"), eq("20221"), eq("A")))
        .thenReturn(result);
    when(ucsbCurriculumService.getConvertedSections(eq("CMPSC"), eq("20222"), eq("A")))
        .thenReturn(result);
    when(convertedSectionCollection.saveAll(any())).thenReturn(result);

    // Act

    updateCourseDataRangeOfQuartersSingleSubjectJob.accept(ctx);

    // Assert

    String expected =
        """
                                Updating courses for [CMPSC 20221]
                                Found 14 sections
                                Storing in MongoDB Collection...
                                14 new sections saved, 0 sections updated, 0 errors
                                Courses for [CMPSC 20221] have been updated
                                Updating courses for [CMPSC 20222]
                                Found 14 sections
                                Storing in MongoDB Collection...
                                14 new sections saved, 0 sections updated, 0 errors
                                Courses for [CMPSC 20222] have been updated""";

    assertEquals(expected, jobStarted.getLog());
  }
}
