package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.PersonalSchedule;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.repositories.PersonalScheduleRepository;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = PersonalSchedulesController.class)
@Import(TestConfig.class)
public class PersonalSchedulesControllerTests extends ControllerTestCase {

    @MockBean
    PersonalScheduleRepository personalscheduleRepository;

    @MockBean
    UserRepository userRepository;

    // Authorization tests for /api/personalschedules/admin/all

    @Test
    public void api_schedules_admin_all__logged_out__returns_403() throws Exception {
        mockMvc.perform(get("/api/personalschedules/admin/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_schedules_admin_all__user_logged_in__returns_403() throws Exception {
        mockMvc.perform(get("/api/personalschedules/admin/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_schedules_admin__user_logged_in__returns_403() throws Exception {
        mockMvc.perform(get("/api/personalschedules/admin?id=7"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void api_schedules_admin_all__admin_logged_in__returns_200() throws Exception {
        mockMvc.perform(get("/api/personalschedules/admin/all"))
                .andExpect(status().isOk());
    }

    // Authorization tests for /api/personalschedules/all

    @Test
    public void api_schedules_all__logged_out__returns_403() throws Exception {
        mockMvc.perform(get("/api/personalschedules/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_schedules_all__user_logged_in__returns_200() throws Exception {
        mockMvc.perform(get("/api/personalschedules/all"))
                .andExpect(status().isOk());
    }

    // Authorization tests for /api/personalschedules/post

    @Test
    public void api_schedules_post__logged_out__returns_403() throws Exception {
        mockMvc.perform(post("/api/personalschedules/post"))
                .andExpect(status().is(403));
    }

    // Tests with mocks for database actions

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_schedules__user_logged_in__returns_a_schedules_that_exists() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        PersonalSchedule personalschedule1 = PersonalSchedule.builder().name("Name 1").description("Description 1").quarter("20221").user(u).id(7L).build();
        when(personalscheduleRepository.findByIdAndUser(eq(7L), eq(u))).thenReturn(Optional.of(personalschedule1));

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules?id=7"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(personalscheduleRepository, times(1)).findByIdAndUser(7L, u);
        String expectedJson = mapper.writeValueAsString(personalschedule1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_schedules__user_logged_in__search_for_schedules_that_does_not_exist() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();

        when(personalscheduleRepository.findByIdAndUser(eq(7L), eq(u))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules?id=7"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(personalscheduleRepository, times(1)).findByIdAndUser(7L, u);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 7 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_schedules__user_logged_in__search_for_schedules_that_belongs_to_another_user() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        User otherUser = User.builder().id(999L).build();
        PersonalSchedule otherUsersPersonalschedule = PersonalSchedule.builder().name("Name 1").description("Description 1").quarter("20221").user(otherUser).id(13L)
                .build();

        when(personalscheduleRepository.findByIdAndUser(eq(13L), eq(otherUser))).thenReturn(Optional.of(otherUsersPersonalschedule));

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules?id=13"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(personalscheduleRepository, times(1)).findByIdAndUser(13L, u);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 13 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void api_schedules__admin_logged_in__search_for_schedule_that_belongs_to_another_user() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        User otherUser = User.builder().id(999L).build();
        PersonalSchedule otherUsersPersonalschedule = PersonalSchedule.builder().name("Name 1").description("Description 1").quarter("20221").user(otherUser).id(27L)
                .build();

        when(personalscheduleRepository.findById(eq(27L))).thenReturn(Optional.of(otherUsersPersonalschedule));

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules/admin?id=27"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(personalscheduleRepository, times(1)).findById(27L);
        String expectedJson = mapper.writeValueAsString(otherUsersPersonalschedule);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void api_schedules__admin_logged_in__search_for_schedule_that_does_not_exist() throws Exception {

        // arrange

        when(personalscheduleRepository.findById(eq(29L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules/admin?id=29"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(personalscheduleRepository, times(1)).findById(29L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 29 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void api_schedules_admin_all__admin_logged_in__returns_all_schedules() throws Exception {

        // arrange

        User u1 = User.builder().id(1L).build();
        User u2 = User.builder().id(2L).build();
        User u = currentUserService.getCurrentUser().getUser();

        PersonalSchedule p1 = PersonalSchedule.builder().name("Name 1").description("Description 1").quarter("20221").user(u1).id(1L).build();
        PersonalSchedule p2 = PersonalSchedule.builder().name("Name 2").description("Description 2").quarter("20222").user(u2).id(2L).build();
        PersonalSchedule p3 = PersonalSchedule.builder().name("Name 3").description("Description 3").quarter("20223").user(u).id(3L).build();

        ArrayList<PersonalSchedule> expectedSchedules = new ArrayList<>();
        expectedSchedules.addAll(Arrays.asList(p1, p2, p3));

        when(personalscheduleRepository.findAll()).thenReturn(expectedSchedules);

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules/admin/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(personalscheduleRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedSchedules);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_schedules_all__user_logged_in__returns_only_schedules_for_user() throws Exception {

        // arrange

        User thisUser = currentUserService.getCurrentUser().getUser();

        PersonalSchedule p1 = PersonalSchedule.builder().name("Name 1").description("Description 1").quarter("20221").user(thisUser).id(1L).build();
        PersonalSchedule p2 = PersonalSchedule.builder().name("Name 2").description("Description 2").quarter("20222").user(thisUser).id(2L).build();

        ArrayList<PersonalSchedule> expectedSchedules = new ArrayList<>();
        expectedSchedules.addAll(Arrays.asList(p1, p2));
        when(personalscheduleRepository.findAllByUserId(thisUser.getId())).thenReturn(expectedSchedules);

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(personalscheduleRepository, times(1)).findAllByUserId(eq(thisUser.getId()));
        String expectedJson = mapper.writeValueAsString(expectedSchedules);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_schedules_post__user_logged_in() throws Exception {
        // arrange

        User thisUser = currentUserService.getCurrentUser().getUser();

        PersonalSchedule expectedSchedule = PersonalSchedule.builder().name("Test Name").description("Test Description").quarter("20222").user(thisUser).id(0L).build();

        when(personalscheduleRepository.save(eq(expectedSchedule))).thenReturn(expectedSchedule);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/personalschedules/post?name=Test Name&description=Test Description&quarter=20222")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(personalscheduleRepository, times(1)).save(expectedSchedule);
        String expectedJson = mapper.writeValueAsString(expectedSchedule);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

}