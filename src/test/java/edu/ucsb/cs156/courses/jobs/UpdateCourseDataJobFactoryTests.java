package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;

@RestClientTest(UpdateCourseDataJobFactory.class)
@AutoConfigureDataJpa
public class UpdateCourseDataJobFactoryTests {

    @MockBean
    UCSBCurriculumService ucsbCurriculumService;

    @MockBean
    ConvertedSectionCollection convertedSectionCollection;

    @Autowired
    UpdateCourseDataJobFactory updateCourseDataJobFactory;

    @Test
    void test_create() throws Exception {

        // Act

        UpdateCourseDataJob updateCourseDataJob = updateCourseDataJobFactory.create("CMPSC", "20211");

        // Assert

        assertEquals("CMPSC",updateCourseDataJob.getSubjectArea());
        assertEquals("20211",updateCourseDataJob.getQuarterYYYYQ());
        assertEquals(ucsbCurriculumService,updateCourseDataJob.getUcsbCurriculumService());
        assertEquals(convertedSectionCollection,updateCourseDataJob.getConvertedSectionCollection());

    }
}