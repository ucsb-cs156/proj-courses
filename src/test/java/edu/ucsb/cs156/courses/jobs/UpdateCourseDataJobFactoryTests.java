package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.services.CourseDataService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(classes = UpdateCourseDataJobFactory.class)
public class UpdateCourseDataJobFactoryTests {

    @MockBean
    CourseDataService courseDataService;

    @Autowired
    UpdateCourseDataJobFactory updateCourseDataJobFactory;

    @Test
    void test_create() throws Exception {

        // Act

        UpdateCourseDataJob updateCourseDataJob = updateCourseDataJobFactory.create("CMPSC", "20211");

        // Assert

        assertEquals(List.of("CMPSC"), updateCourseDataJob.getSubjects());
        assertEquals("20211", updateCourseDataJob.getStart_quarterYYYYQ());
        assertEquals("20211", updateCourseDataJob.getEnd_quarterYYYYQ());
        assertEquals(courseDataService, updateCourseDataJob.getCourseDataService());
    }
}
