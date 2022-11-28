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

@RestClientTest(UpdateCourseDataWithQuarterJobFactory.class)
@AutoConfigureDataJpa
public class UpdateCourseDataWithQuarterJobFactoryTests {

    @MockBean
    UCSBCurriculumService ucsbCurriculumService;

    @MockBean
    ConvertedSectionCollection convertedSectionCollection;

    @Autowired
    UpdateCourseDataWithQuarterJobFactory updateCourseDataWithQuarterJobFactory;

    @Test
    void test_create() throws Exception {

        // Act

        UpdateCourseDataWithQuarterJob updateCourseDataWithQuarterJob = updateCourseDataWithQuarterJobFactory.create("20212");

        // Assert

        assertEquals("20212",updateCourseDataWithQuarterJob.getQuarterYYYYQ());
        assertEquals(ucsbCurriculumService,updateCourseDataWithQuarterJob.getUcsbCurriculumService());
        assertEquals(convertedSectionCollection,updateCourseDataWithQuarterJob.getConvertedSectionCollection());

    }
}