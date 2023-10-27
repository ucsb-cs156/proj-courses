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

@SpringBootTest(classes = UpdateCourseDataJobFactory.class)
public class UpdateCourseDataJobFactoryTests {

    @MockBean
    CourseDataService courseDataService;
    @MockBean
    UCSBSubjectRepository ucsbSubjectRepository;

    @Autowired
    UpdateCourseDataJobFactory factory;

    @Test
    void test_createForSubjectAndQuarter() {

        // Act
        UpdateCourseDataJob job = factory.createForSubjectAndQuarter("CMPSC", "20211");

        // Assert
        assertEquals(List.of("CMPSC"), job.getSubjects());
        assertEquals("20211", job.getStart_quarterYYYYQ());
        assertEquals("20211", job.getEnd_quarterYYYYQ());
        assertEquals(courseDataService, job.getCourseDataService());
    }

    @Test
    void test_createForSubjectAndQuarterRange() {

        // Act
        UpdateCourseDataJob job = factory.createForSubjectAndQuarterRange("CMPSC", "20211", "20213");

        // Assert
        assertEquals(List.of("CMPSC"), job.getSubjects());
        assertEquals("20211", job.getStart_quarterYYYYQ());
        assertEquals("20213", job.getEnd_quarterYYYYQ());
        assertEquals(courseDataService, job.getCourseDataService());
    }

    @Test
    void test_createForQuarter() {

        // Act
        var subjectCodes = List.of("ANTH", "ART CS", "CH E");
        var subjects = subjectCodes.stream()
            .map(subjectName -> UCSBSubject.builder().subjectCode(subjectName).build())
            .toList();

        when(ucsbSubjectRepository.findAll()).thenReturn(subjects);


        UpdateCourseDataJob job = factory.createForQuarter("20211");

        // Assert

        assertEquals("20211", job.getStart_quarterYYYYQ());
        assertEquals("20211", job.getEnd_quarterYYYYQ());
        assertEquals(subjectCodes, job.getSubjects());
        assertEquals(courseDataService, job.getCourseDataService());
    }

    @Test
    void test_createForQuarterRange() {

        // arrange
        var subjectCodes = List.of("ANTH", "ART CS", "CH E");
        var subjects = subjectCodes.stream()
            .map(subjectName -> UCSBSubject.builder().subjectCode(subjectName).build())
            .toList();

        // Act

        when(ucsbSubjectRepository.findAll()).thenReturn(subjects);

        UpdateCourseDataJob job = factory.createForQuarterRange("20221", "20222");

        // Assert
        assertEquals("20221", job.getStart_quarterYYYYQ());
        assertEquals("20222", job.getEnd_quarterYYYYQ());
        assertEquals(courseDataService, job.getCourseDataService());
        assertEquals(subjectCodes, job.getSubjects());
    }


}
