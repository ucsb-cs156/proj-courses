package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.documents.Course;
import edu.ucsb.cs156.courses.documents.PersonalSectionsFixtures;
import edu.ucsb.cs156.courses.entities.PersonalSchedule;
import edu.ucsb.cs156.courses.entities.GradeHistory;
import edu.ucsb.cs156.courses.entities.PSCourse;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.errors.EntityNotFoundException;
import edu.ucsb.cs156.courses.repositories.PersonalScheduleRepository;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;
import edu.ucsb.cs156.courses.repositories.PSCourseRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.UCSBGradeHistoryService;
import edu.ucsb.cs156.courses.testconfig.TestConfig;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.lang.Iterable;
import java.lang.String;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = { GradeHistoryController.class })
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class GradeHistoryControllerTests extends ControllerTestCase {

    @MockBean
    GradeHistoryRepository gradeHistoryRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void test_getGradeHistory() throws Exception {

        // arrange

        List<GradeHistory> gradeHistoryRows = new ArrayList<GradeHistory>();
        gradeHistoryRows.add(GradeHistory.builder()
                .course("CMPSC   130A")
                .yyyyq("20204")
                .grade("A")
                .count(1)
                .instructor("STAFF")
                .build());
        gradeHistoryRows.add(GradeHistory.builder()
                .course("CMPSC   130A")
                .yyyyq("20204")
                .grade("B")
                .count(2)
                .instructor("STAFF")
                .build());

        when(gradeHistoryRepository.findByCourse(eq("CMPSC   130A"))).thenReturn(gradeHistoryRows);

        // act

        MvcResult response = mockMvc.perform(get("/api/gradehistory/search?subjectArea=CMPSC&courseNumber=130A"))
                .andExpect(status().isOk()).andReturn();

        // assert
        String expectedResponseAsJson = objectMapper.writeValueAsString(gradeHistoryRows);
        String actualResponse = response.getResponse().getContentAsString();
        assertEquals(expectedResponseAsJson, actualResponse);
    }

}