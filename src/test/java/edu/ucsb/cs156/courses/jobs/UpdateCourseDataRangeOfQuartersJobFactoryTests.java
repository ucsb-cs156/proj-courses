package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.entities.UCSBSubject;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.courses.services.CourseDataService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;


@SpringBootTest(classes = UpdateCourseDataRangeOfQuartersJobFactory.class)
public class UpdateCourseDataRangeOfQuartersJobFactoryTests {
    @MockBean
    CourseDataService courseDataService;

    @MockBean
    UCSBSubjectRepository subjectRepository;

    @Autowired
    UpdateCourseDataRangeOfQuartersJobFactory updateCourseDataRangeOfQuartersJobFactory;

    @Test
    void test_create() {

        // arrange

        var subjectCodes = List.of("ANTH", "ART CS", "CH E");
        var subjects = subjectCodes.stream()
            .map(subjectName -> UCSBSubject.builder().subjectCode(subjectName).build())
            .toList();

        // Act

        when(subjectRepository.findAll()).thenReturn(subjects);

        UpdateCourseDataJob updateCourseDataRangeOfQuartersJob = updateCourseDataRangeOfQuartersJobFactory.create("20221", "20222");

        // Assert

        assertEquals("20221", updateCourseDataRangeOfQuartersJob.getStart_quarterYYYYQ());
        assertEquals("20222", updateCourseDataRangeOfQuartersJob.getEnd_quarterYYYYQ());
        assertEquals(courseDataService, updateCourseDataRangeOfQuartersJob.getCourseDataService());
        assertEquals(subjectCodes, updateCourseDataRangeOfQuartersJob.getSubjects());
    }
}
