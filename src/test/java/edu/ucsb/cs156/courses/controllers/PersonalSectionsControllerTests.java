package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.documents.Course;
import edu.ucsb.cs156.courses.documents.PersonalSectionsFixtures;
import edu.ucsb.cs156.courses.entities.PSCourse;
import edu.ucsb.cs156.courses.entities.PersonalSchedule;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.repositories.PSCourseRepository;
import edu.ucsb.cs156.courses.repositories.PersonalScheduleRepository;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import java.io.*;
import java.util.ArrayList;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = {PersonalSectionsController.class})
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class PersonalSectionsControllerTests extends ControllerTestCase {

  @MockBean PersonalScheduleRepository personalscheduleRepository;

  @MockBean UserRepository userRepository;

  @MockBean PSCourseRepository coursesRepository;

  @MockBean private UCSBCurriculumService ucsbCurriculumService;

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  // Authorization tests for /api/personalschedules/admin/psid/sections/all

  @Test
  public void api_psid_sections__logged_out__returns_403() throws Exception {
    mockMvc.perform(get("/api/personalSections/all?psId=1")).andExpect(status().is(403));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_psid_sections__user_logged_in__no_personal_schedule() throws Exception {

    MvcResult response =
        mockMvc
            .perform(get("/api/personalSections/all?psId=13"))
            .andExpect(status().is(404))
            .andReturn();
    String actual = response.getResponse().getContentAsString();
    boolean correct = actual.contains("EntityNotFoundException");
    assertEquals(correct, true);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_psid_sections__user_logged_in__returns_existing_course() throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Name 1")
            .description("Description 1")
            .quarter("20221")
            .user(u)
            .id(13L)
            .build();
    PSCourse course1 = PSCourse.builder().id(1L).user(u).enrollCd("59501").psId(13L).build();
    Course course = objectMapper.readValue(PersonalSectionsFixtures.ONE_COURSE, Course.class);
    ArrayList<PSCourse> crs = new ArrayList<PSCourse>();
    crs.add(course1);

    when(personalscheduleRepository.findByIdAndUser(eq(13L), eq(u))).thenReturn(Optional.of(ps));
    when((coursesRepository.findAllByPsId(eq(13L)))).thenReturn(crs);
    when(ucsbCurriculumService.getJSONbyQtrEnrollCd(eq("20221"), eq("59501")))
        .thenReturn(PersonalSectionsFixtures.ONE_COURSE);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/personalSections/all?psId=13"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findAllByPsId(13L);
    verify(ucsbCurriculumService, times(1)).getJSONbyQtrEnrollCd("20221", "59501");
    String expectedJson = mapper.writeValueAsString(course);
    expectedJson = "[" + expectedJson + "]";
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(
      username = "user",
      roles = {"USER"})
  @Test
  public void api_deleteScheduleAndLectures__user_logged_in__successful_deletion()
      throws Exception {
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Name 1")
            .description("Description 1")
            .quarter("20221")
            .user(u)
            .id(13L)
            .build();
    PSCourse course1 = PSCourse.builder().id(1L).user(u).enrollCd("59501").psId(13L).build();
    PSCourse course2 = PSCourse.builder().id(2L).user(u).enrollCd("59502").psId(13L).build();
    ArrayList<PSCourse> crs = new ArrayList<>();
    crs.add(course1);
    crs.add(course2);
    when(personalscheduleRepository.findByIdAndUser(eq(13L), eq(u))).thenReturn(Optional.of(ps));
    when(coursesRepository.findAllByPsId(eq(13L))).thenReturn(crs);
    when(ucsbCurriculumService.getAllSections(eq("59501"), eq("20221")))
        .thenReturn(
            "{\"classSections\": [{\"enrollCode\": \"59501\"}, {\"enrollCode\": \"59502\"}]}");
    MvcResult response =
        mockMvc
            .perform(
                delete("/api/personalSections/delete")
                    .param("psId", "13")
                    .param("enrollCd", "59501")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();
    verify(coursesRepository, times(1)).delete(course1);
    verify(coursesRepository, times(1)).delete(course2);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(
        "{\"message\":\"Schedule with psId 13 and associated lectures with enrollCd 59501 deleted\"}",
        responseString);
  }

  @WithMockUser(
      username = "user",
      roles = {"USER"})
  @Test
  public void api_deleteScheduleAndLectures__user_logged_in__unauthorized_error_from_service()
      throws Exception {
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Name 1")
            .description("Description 1")
            .quarter("20221")
            .user(u)
            .id(13L)
            .build();
    PSCourse course1 = PSCourse.builder().id(1L).user(u).enrollCd("59501").psId(13L).build();
    PSCourse course2 = PSCourse.builder().id(2L).user(u).enrollCd("59502").psId(13L).build();
    ArrayList<PSCourse> crs = new ArrayList<>();
    crs.add(course1);
    crs.add(course2);
    when(personalscheduleRepository.findByIdAndUser(eq(13L), eq(u))).thenReturn(Optional.of(ps));
    when(coursesRepository.findAllByPsId(eq(13L))).thenReturn(crs);
    when(ucsbCurriculumService.getAllSections(eq("59501"), eq("20221")))
        .thenReturn("{\"error\": \"401: Unauthorized\"}");
    MvcResult response =
        mockMvc
            .perform(
                delete("/api/personalSections/delete")
                    .param("psId", "13")
                    .param("enrollCd", "59501")
                    .with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();
    String responseString = response.getResponse().getContentAsString();
    boolean correct = responseString.contains("EntityNotFoundException");
    assertEquals(true, correct);
  }

  @WithMockUser(
      username = "user",
      roles = {"USER"})
  @Test
  public void api_deleteScheduleAndLectures__user_logged_in__enroll_code_doesnt_exist_in_quarter()
      throws Exception {
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Name 1")
            .description("Description 1")
            .quarter("20221")
            .user(u)
            .id(13L)
            .build();
    PSCourse course1 = PSCourse.builder().id(1L).user(u).enrollCd("59501").psId(13L).build();
    ArrayList<PSCourse> crs = new ArrayList<>();
    crs.add(course1);

    when(personalscheduleRepository.findByIdAndUser(eq(13L), eq(u))).thenReturn(Optional.of(ps));
    when(coursesRepository.findAllByPsId(eq(13L))).thenReturn(crs);
    when(ucsbCurriculumService.getAllSections(eq("59501"), eq("20221")))
        .thenReturn("{\"error\": \"Enroll code doesn't exist in that quarter.\"}");

    MvcResult response =
        mockMvc
            .perform(
                delete("/api/personalSections/delete")
                    .param("psId", "13")
                    .param("enrollCd", "59501")
                    .with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    verify(coursesRepository, times(0)).delete(course1);
    String responseString = response.getResponse().getContentAsString();
    boolean correct = responseString.contains("EntityNotFoundException");
    assertEquals(true, correct);
  }

  @WithMockUser(
      username = "user",
      roles = {"USER"})
  @Test
  public void api_deleteScheduleAndLectures__user_logged_in__no_such_schedule() throws Exception {
    User u = currentUserService.getCurrentUser().getUser();

    when(personalscheduleRepository.findByIdAndUser(eq(13L), eq(u))).thenReturn(Optional.empty());
    MvcResult response =
        mockMvc
            .perform(
                delete("/api/personalSections/delete")
                    .param("psId", "13")
                    .param("enrollCd", "59501")
                    .with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();
    String responseString = response.getResponse().getContentAsString();
    boolean correct = responseString.contains("EntityNotFoundException");
    assertEquals(true, correct);
  }

  @WithMockUser(
      username = "user",
      roles = {"USER"})
  @Test
  public void api_deleteScheduleAndLectures__user_logged_in__no_such_course() throws Exception {
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Name 1")
            .description("Description 1")
            .quarter("20221")
            .user(u)
            .id(13L)
            .build();
    ArrayList<PSCourse> crs = new ArrayList<>();
    String body = PersonalSectionsFixtures.ONE_COURSE;

    when(personalscheduleRepository.findByIdAndUser(eq(13L), eq(u))).thenReturn(Optional.of(ps));
    when(coursesRepository.findAllByPsId(eq(13L))).thenReturn(crs);
    when(ucsbCurriculumService.getAllSections(eq("59501"), eq("20221"))).thenReturn(body);
    MvcResult response =
        mockMvc
            .perform(
                delete("/api/personalSections/delete")
                    .param("psId", "13")
                    .param("enrollCd", "59501")
                    .with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();
    String responseString = response.getResponse().getContentAsString();
    boolean correct = responseString.contains("EntityNotFoundException");
    assertEquals(true, correct);
  }
}