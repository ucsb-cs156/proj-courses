package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.documents.Course;
import edu.ucsb.cs156.courses.documents.PersonalSectionsFixtures;
import edu.ucsb.cs156.courses.entities.PersonalSchedule;
import edu.ucsb.cs156.courses.entities.PSCourse;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.errors.EntityNotFoundException;
import edu.ucsb.cs156.courses.repositories.PersonalScheduleRepository;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.repositories.PSCourseRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.testconfig.TestConfig;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.springframework.beans.factory.annotation.Autowired;
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


import java.io.*;

@WebMvcTest(controllers = {PersonalSectionsController.class})
@Import(TestConfig.class)
public class PersonalSectionsControllerTests extends ControllerTestCase {

    @MockBean
    PersonalScheduleRepository personalscheduleRepository;

    @MockBean
    UserRepository userRepository;

    @MockBean
    PSCourseRepository coursesRepository;

    @MockBean
    private UCSBCurriculumService ucsbCurriculumService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Authorization tests for /api/personalschedules/admin/psid/sections/all

    @Test
    public void api_psid_sections__logged_out__returns_403() throws Exception {
        mockMvc.perform(get("/api/personalSections/all?psId=1"))
                .andExpect(status().is(403));
    }



    @WithMockUser(roles = { "USER" })
    @Test
    public void api_psid_sections__user_logged_in__no_personal_schedule() throws Exception {

        MvcResult response = mockMvc.perform(get("/api/personalSections/all?psId=13"))
                .andExpect(status().is(404)).andReturn();
        String actual = response.getResponse().getContentAsString();
        boolean correct = actual.contains("EntityNotFoundException");
        assertEquals(correct, true);

    }


    @WithMockUser(roles = { "USER" })
    @Test
    public void api_psid_sections__user_logged_in__returns_existing_course() throws Exception {
        // arrange
        User u = currentUserService.getCurrentUser().getUser();
        PersonalSchedule ps = PersonalSchedule.builder().name("Name 1").description("Description 1").quarter("20221").user(u).id(13L)
                .build();
        PSCourse course1 = PSCourse.builder().id(1L).user(u).enrollCd("59501").psId(13L).build();
        Course course = objectMapper.readValue(PersonalSectionsFixtures.ONE_COURSE, Course.class);
        ArrayList<PSCourse> crs = new ArrayList<PSCourse>();
        crs.add(course1);

        when(personalscheduleRepository.findByIdAndUser(eq(13L), eq(u))).thenReturn(Optional.of(ps));
        when((coursesRepository.findAllByPsId(eq(13L)))).thenReturn(crs);
        when(ucsbCurriculumService.getJSONbyQtrEnrollCd(eq("20221"),eq("59501")))
                .thenReturn(PersonalSectionsFixtures.ONE_COURSE);


        // act
        MvcResult response = mockMvc.perform(get("/api/personalSections/all?psId=13"))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(coursesRepository, times(1)).findAllByPsId(13L);
        verify(ucsbCurriculumService, times(1)).getJSONbyQtrEnrollCd("20221","59501");
        String expectedJson = mapper.writeValueAsString(course);
        expectedJson = "[" + expectedJson + "]";
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }



}
