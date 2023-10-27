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

@SpringBootTest(classes = {UpdateCourseDataWithQuarterJobFactory.class})
public class UpdateCourseDataWithQuarterJobFactoryTests {

    @MockBean
    UCSBSubjectRepository ucsbSubjectRepository;

    @MockBean
    CourseDataService courseDataService;

    @Autowired
    UpdateCourseDataWithQuarterJobFactory updateCourseDataWithQuarterJobFactory;

    @Test
    void test_create() throws Exception {

        // Act

        var subjectCodes = List.of("ANTH", "ART CS", "CH E");
        var subjects = subjectCodes.stream()
            .map(subjectName -> UCSBSubject.builder().subjectCode(subjectName).build())
            .toList();

        when(ucsbSubjectRepository.findAll()).thenReturn(subjects);


        var updateCourseDataWithQuarterJob = updateCourseDataWithQuarterJobFactory.create("20212");

        // Assert


        assertEquals("20212", updateCourseDataWithQuarterJob.getStart_quarterYYYYQ());
        assertEquals("20212", updateCourseDataWithQuarterJob.getEnd_quarterYYYYQ());
        assertEquals(subjectCodes, updateCourseDataWithQuarterJob.getSubjects());
        assertEquals(courseDataService, updateCourseDataWithQuarterJob.getCourseDataService());
    }
}
