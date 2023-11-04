package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.documents.SectionFixtures;
import edu.ucsb.cs156.courses.entities.PSCourse;
import edu.ucsb.cs156.courses.entities.PersonalSchedule;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.repositories.PSCourseRepository;
import edu.ucsb.cs156.courses.repositories.PersonalScheduleRepository;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = PSCourseController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class PSCourseControllerTests extends ControllerTestCase {

  @MockBean PSCourseRepository coursesRepository;

  @MockBean PersonalScheduleRepository personalScheduleRepository;

  @MockBean UCSBCurriculumService ucsbCurriculumService;

  @MockBean UserRepository userRepository;

  // Authorization tests for /api/courses/admin/all

  @Test
  public void api_courses_admin_all__logged_out__returns_403() throws Exception {
    mockMvc.perform(get("/api/courses/admin/all")).andExpect(status().is(403));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses_admin_all__user_logged_in__returns_403() throws Exception {
    mockMvc.perform(get("/api/courses/admin/all")).andExpect(status().is(403));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses_admin__user_logged_in__returns_403() throws Exception {
    mockMvc.perform(get("/api/courses/admin?id=7")).andExpect(status().is(403));
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void api_courses_admin_all__admin_logged_in__returns_200() throws Exception {
    mockMvc.perform(get("/api/courses/admin/all")).andExpect(status().isOk());
  }

  // Authorization tests for /api/courses/all

  @Test
  public void api_courses_all__logged_out__returns_403() throws Exception {
    mockMvc.perform(get("/api/courses/all"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses_all__user_logged_in__returns_200() throws Exception {
    mockMvc.perform(get("/api/courses/user/all")).andExpect(status().isOk());
  }

  // Authorization tests for /api/courses/post

  @Test
  public void api_courses_post__logged_out__returns_403() throws Exception {
    mockMvc.perform(post("/api/courses/post")).andExpect(status().is(403));
  }

  // Tests with mocks for database actions

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__returns_a_courses_that_exists() throws Exception {

    // arrange

    User u = currentUserService.getCurrentUser().getUser();
    PSCourse course1 = PSCourse.builder().enrollCd("08250").psId(13L).user(u).id(7L).build();
    when(coursesRepository.findByIdAndUser(eq(7L), eq(u))).thenReturn(Optional.of(course1));

    // act
    MvcResult response =
        mockMvc.perform(get("/api/courses/user?id=7")).andExpect(status().isOk()).andReturn();

    // assert

    verify(coursesRepository, times(1)).findByIdAndUser(7L, u);
    String expectedJson = mapper.writeValueAsString(course1);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__search_for_courses_that_does_not_exist()
      throws Exception {

    // arrange

    User u = currentUserService.getCurrentUser().getUser();

    when(coursesRepository.findByIdAndUser(eq(7L), eq(u))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc.perform(get("/api/courses/user?id=7")).andExpect(status().isNotFound()).andReturn();

    // assert

    verify(coursesRepository, times(1)).findByIdAndUser(7L, u);
    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("PSCourse with id 7 not found", json.get("message"));
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void api_courses__admin_logged_in__returns_a_courses_that_exists_using_psid()
      throws Exception {

    // arrange

    User u = currentUserService.getCurrentUser().getUser();
    PSCourse course1 = PSCourse.builder().enrollCd("08250").psId(13L).user(u).id(7L).build();
    PSCourse course2 = PSCourse.builder().enrollCd("08251").psId(13L).user(u).id(8L).build();
    ArrayList<PSCourse> expectedCourses = new ArrayList<>();
    expectedCourses.addAll(Arrays.asList(course1, course2));
    when(coursesRepository.findAllByPsId(13L)).thenReturn(expectedCourses);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/courses/admin/psid/all?psId=13"))
            .andExpect(status().isOk())
            .andReturn();

    // assert

    verify(coursesRepository, times(1)).findAllByPsId(13L);
    String expectedJson = mapper.writeValueAsString(expectedCourses);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__returns_a_courses_that_exists_using_psid()
      throws Exception {

    // arrange

    User u = currentUserService.getCurrentUser().getUser();
    PSCourse course1 = PSCourse.builder().enrollCd("08250").psId(13L).user(u).id(7L).build();
    PSCourse course2 = PSCourse.builder().enrollCd("08251").psId(13L).user(u).id(8L).build();
    ArrayList<PSCourse> expectedCourses = new ArrayList<>();
    expectedCourses.addAll(Arrays.asList(course1, course2));
    when(coursesRepository.findAllByPsIdAndUser(13L, u)).thenReturn(expectedCourses);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/courses/user/psid/all?psId=13"))
            .andExpect(status().isOk())
            .andReturn();

    // assert

    verify(coursesRepository, times(1)).findAllByPsIdAndUser(13L, u);
    String expectedJson = mapper.writeValueAsString(expectedCourses);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__search_for_courses_that_belongs_to_another_user()
      throws Exception {

    // arrange

    User u = currentUserService.getCurrentUser().getUser();
    User otherUser = User.builder().id(999L).build();
    PSCourse otherUsersCourses =
        PSCourse.builder().enrollCd("08250").psId(13L).user(otherUser).id(13L).build();

    when(coursesRepository.findByIdAndUser(eq(13L), eq(otherUser)))
        .thenReturn(Optional.of(otherUsersCourses));

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/courses/user?id=13"))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert

    verify(coursesRepository, times(1)).findByIdAndUser(13L, u);
    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("PSCourse with id 13 not found", json.get("message"));
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void api_courses__admin_logged_in__search_for_course_that_belongs_to_another_user()
      throws Exception {

    // arrange

    User u = currentUserService.getCurrentUser().getUser();
    User otherUser = User.builder().id(999L).build();
    PSCourse otherUsersCourses =
        PSCourse.builder().enrollCd("08250").psId(13L).user(otherUser).id(27L).build();

    when(coursesRepository.findById(eq(27L))).thenReturn(Optional.of(otherUsersCourses));

    // act
    MvcResult response =
        mockMvc.perform(get("/api/courses/admin?id=27")).andExpect(status().isOk()).andReturn();

    // assert

    verify(coursesRepository, times(1)).findById(27L);
    String expectedJson = mapper.writeValueAsString(otherUsersCourses);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void api_courses__admin_logged_in__search_for_course_that_does_not_exist()
      throws Exception {

    // arrange

    when(coursesRepository.findById(eq(29L))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/courses/admin?id=29"))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert

    verify(coursesRepository, times(1)).findById(29L);
    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("PSCourse with id 29 not found", json.get("message"));
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void api_courses_admin_all__admin_logged_in__returns_all_courses() throws Exception {

    // arrange

    User u1 = User.builder().id(1L).build();
    User u2 = User.builder().id(2L).build();
    User u = currentUserService.getCurrentUser().getUser();

    PSCourse p1 = PSCourse.builder().enrollCd("08250").psId(13L).user(u1).id(1L).build();
    PSCourse p2 = PSCourse.builder().enrollCd("08276").psId(13L).user(u2).id(2L).build();
    PSCourse p3 = PSCourse.builder().enrollCd("08078").psId(13L).user(u).id(3L).build();

    ArrayList<PSCourse> expectedCourses = new ArrayList<>();
    expectedCourses.addAll(Arrays.asList(p1, p2, p3));

    when(coursesRepository.findAll()).thenReturn(expectedCourses);

    // act
    MvcResult response =
        mockMvc.perform(get("/api/courses/admin/all")).andExpect(status().isOk()).andReturn();

    // assert

    verify(coursesRepository, times(1)).findAll();
    String expectedJson = mapper.writeValueAsString(expectedCourses);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses_all__user_logged_in__returns_only_courses_for_user() throws Exception {

    // arrange

    User thisUser = currentUserService.getCurrentUser().getUser();

    PSCourse p1 = PSCourse.builder().enrollCd("08250").psId(13L).user(thisUser).id(1L).build();
    PSCourse p2 = PSCourse.builder().enrollCd("08276").psId(13L).user(thisUser).id(2L).build();

    ArrayList<PSCourse> expectedCourses = new ArrayList<>();
    expectedCourses.addAll(Arrays.asList(p1, p2));
    when(coursesRepository.findAllByUserId(thisUser.getId())).thenReturn(expectedCourses);

    // act
    MvcResult response =
        mockMvc.perform(get("/api/courses/user/all")).andExpect(status().isOk()).andReturn();

    // assert

    verify(coursesRepository, times(1)).findAllByUserId(eq(thisUser.getId()));
    String expectedJson = mapper.writeValueAsString(expectedCourses);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses_post__user_logged_in__primary_enroll_code() throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();

    PersonalSchedule personalschedule1 =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u)))
        .thenReturn(Optional.of(personalschedule1));
    when(ucsbCurriculumService.getAllSections(eq("08896"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC291A);

    PSCourse expectedPrimary = PSCourse.builder().enrollCd("08896").psId(1L).user(u).id(0L).build();
    when(coursesRepository.save(eq(expectedPrimary))).thenReturn(expectedPrimary);
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("08896"))).thenReturn(Optional.empty());

    ArrayList<PSCourse> expectedCourses = new ArrayList<>();
    expectedCourses.add(expectedPrimary);

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/courses/post?enrollCd=08896&psId=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).save(expectedPrimary);
    String expectedJson = mapper.writeValueAsString(expectedCourses);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses_post__user_logged_in__primary_enroll_code_already_exists()
      throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();

    PersonalSchedule personalschedule1 =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u)))
        .thenReturn(Optional.of(personalschedule1));
    when(ucsbCurriculumService.getAllSections(eq("08896"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC291A);

    PSCourse expectedPrimary = PSCourse.builder().enrollCd("08896").psId(1L).user(u).id(0L).build();
    when(coursesRepository.save(eq(expectedPrimary))).thenReturn(expectedPrimary);
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("08896")))
        .thenReturn(Optional.of(expectedPrimary));

    ArrayList<PSCourse> expectedCourses = new ArrayList<>();
    expectedCourses.add(expectedPrimary);

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/courses/post?enrollCd=08896&psId=1").with(csrf()))
            .andExpect(status().is(400))
            .andReturn();

    // assert
    Map<String, Object> json = responseToJson(response);
    assertEquals("class exists in schedule", json.get("message"));
    assertEquals("IllegalArgumentException", json.get("type"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses_post__user_logged_in__primary_enroll_code_has_one_secondary()
      throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();

    PersonalSchedule personalschedule1 =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u)))
        .thenReturn(Optional.of(personalschedule1));
    when(ucsbCurriculumService.getAllSections(eq("63370"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC100);
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("63370"))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/courses/post?enrollCd=63370&psId=1").with(csrf()))
            .andExpect(status().is(400))
            .andReturn();

    // assert
    Map<String, Object> json = responseToJson(response);
    assertEquals(
        "63370 is for a course with sections; please add a specific section and the lecture will be automatically added",
        json.get("message"));
    assertEquals("IllegalArgumentException", json.get("type"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses_post__user_logged_in__primary_enroll_code_has_one_secondary_reversed()
      throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();

    PersonalSchedule personalschedule1 =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u)))
        .thenReturn(Optional.of(personalschedule1));
    when(ucsbCurriculumService.getAllSections(eq("63370"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC100_REVERSED);
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("63370"))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/courses/post?enrollCd=63370&psId=1").with(csrf()))
            .andExpect(status().is(400))
            .andReturn();

    // assert
    Map<String, Object> json = responseToJson(response);
    assertEquals(
        "63370 is for a course with sections; please add a specific section and the lecture will be automatically added",
        json.get("message"));
    assertEquals("IllegalArgumentException", json.get("type"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void
      api_courses_post__user_logged_in__unexpected_ucsb_api_response_assumes_primary_course()
          throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();

    PersonalSchedule personalschedule1 =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u)))
        .thenReturn(Optional.of(personalschedule1));
    when(ucsbCurriculumService.getAllSections(eq("08896"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC291A_UNEXPECTED);

    PSCourse expectedPrimary = PSCourse.builder().enrollCd("08896").psId(1L).user(u).id(0L).build();
    when(coursesRepository.save(eq(expectedPrimary))).thenReturn(expectedPrimary);
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("08896"))).thenReturn(Optional.empty());

    ArrayList<PSCourse> expectedCourses = new ArrayList<>();
    expectedCourses.add(expectedPrimary);

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/courses/post?enrollCd=08896&psId=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).save(expectedPrimary);
    String expectedJson = mapper.writeValueAsString(expectedCourses);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses_post__user_logged_in__secondary_enroll_code_adds_secondary_and_primary()
      throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();

    PersonalSchedule personalschedule1 =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u)))
        .thenReturn(Optional.of(personalschedule1));
    when(ucsbCurriculumService.getAllSections(eq("63388"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC100);

    PSCourse expectedPrimary = PSCourse.builder().enrollCd("63370").psId(1L).user(u).id(0L).build();
    when(coursesRepository.save(eq(expectedPrimary))).thenReturn(expectedPrimary);

    PSCourse expectedSecondary =
        PSCourse.builder().enrollCd("63388").psId(1L).user(u).id(0L).build();
    when(coursesRepository.save(eq(expectedSecondary))).thenReturn(expectedSecondary);

    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("63370"))).thenReturn(Optional.empty());

    ArrayList<PSCourse> expectedCourses = new ArrayList<>();
    expectedCourses.add(expectedSecondary);
    expectedCourses.add(expectedPrimary);

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/courses/post?enrollCd=63388&psId=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).save(expectedPrimary);
    verify(coursesRepository, times(1)).save(expectedSecondary);
    String expectedJson = mapper.writeValueAsString(expectedCourses);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses_post__user_logged_in__section_order_in_json_does_not_matter()
      throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();

    PersonalSchedule personalschedule1 =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u)))
        .thenReturn(Optional.of(personalschedule1));
    when(ucsbCurriculumService.getAllSections(eq("08326"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC156_UNEXPECTED);

    PSCourse expectedPrimary = PSCourse.builder().enrollCd("08292").psId(1L).user(u).id(0L).build();
    when(coursesRepository.save(eq(expectedPrimary))).thenReturn(expectedPrimary);

    PSCourse expectedSecondary =
        PSCourse.builder().enrollCd("08326").psId(1L).user(u).id(0L).build();
    when(coursesRepository.save(eq(expectedSecondary))).thenReturn(expectedSecondary);

    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("08292"))).thenReturn(Optional.empty());

    ArrayList<PSCourse> expectedCourses = new ArrayList<>();
    expectedCourses.add(expectedSecondary);
    expectedCourses.add(expectedPrimary);

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/courses/post?enrollCd=08326&psId=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).save(expectedPrimary);
    verify(coursesRepository, times(1)).save(expectedSecondary);
    String expectedJson = mapper.writeValueAsString(expectedCourses);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void apiCoursesUserCreatesCourseWithInvalidEnrollCd() throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();

    PersonalSchedule personalschedule1 =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20224")
            .user(u)
            .id(1L)
            .build();
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u)))
        .thenReturn(Optional.of(personalschedule1));

    when(ucsbCurriculumService.getAllSections(eq("test"), eq("20224")))
        .thenReturn("{\"error\": \"Enroll code doesn't exist in that quarter.\"}");

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/courses/post?enrollCd=test&psId=1").with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    Map<String, Object> json = responseToJson(response);
    assertEquals(
        "EnrollCd: test is invalid, (enrollCd must be valid, numeric, and no more than five digits)",
        json.get("message"));
    assertEquals("BadEnrollCdException", json.get("type"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void apiCoursesUserCreatesCourseWithInvalidEnrollCd2() throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();

    PersonalSchedule personalschedule1 =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20224")
            .user(u)
            .id(1L)
            .build();
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u)))
        .thenReturn(Optional.of(personalschedule1));

    when(ucsbCurriculumService.getAllSections(eq("test"), eq("20224")))
        .thenReturn("{\"error\": \"401: Unauthorized\"}");

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/courses/post?enrollCd=test&psId=1").with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    Map<String, Object> json = responseToJson(response);
    assertEquals(
        "EnrollCd: test is invalid, (enrollCd must be valid, numeric, and no more than five digits)",
        json.get("message"));
    assertEquals("BadEnrollCdException", json.get("type"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void apiCoursesUserCreatesCourseWithInvalidPSID() throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/courses/post?enrollCd=08268&psId=1").with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    Map<String, Object> json = responseToJson(response);
    assertEquals("PersonalSchedule with id 1 not found", json.get("message"));
    assertEquals("EntityNotFoundException", json.get("type"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void
      api_courses__user_logged_in__delete_course__ucsb_api__enroll_code_does_not_exist_error__treat_as_primary()
          throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    PSCourse primary = PSCourse.builder().enrollCd("08896").psId(1L).user(u).id(1L).build();

    when(coursesRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(primary));
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(ps));
    when(ucsbCurriculumService.getAllSections(eq("08896"), eq("20221")))
        .thenReturn("{\"error\": \"Enroll code doesn't exist in that quarter.\"}");

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/user?id=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(1L, u);
    verify(coursesRepository, times(1)).delete(primary);
    Map<String, Object> json = responseToJson(response);
    assertEquals("PSCourse with id 1 deleted", json.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void
      api_courses__user_logged_in__delete_course__ucsb_api__unauthorized_error__treat_as_primary()
          throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    PSCourse primary = PSCourse.builder().enrollCd("08896").psId(1L).user(u).id(1L).build();

    when(coursesRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(primary));
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(ps));
    when(ucsbCurriculumService.getAllSections(eq("08896"), eq("20221")))
        .thenReturn("{\"error\": \"401: Unauthorized\"}");

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/user?id=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(1L, u);
    verify(coursesRepository, times(1)).delete(primary);
    Map<String, Object> json = responseToJson(response);
    assertEquals("PSCourse with id 1 deleted", json.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void
      api_courses__user_logged_in__delete_course__ucsb_api__primary_not_found__treat_as_primary()
          throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    PSCourse primary = PSCourse.builder().enrollCd("08896").psId(1L).user(u).id(1L).build();

    when(coursesRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(primary));
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(ps));
    when(ucsbCurriculumService.getAllSections(eq("08896"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC291A_UNEXPECTED);
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("08896")))
        .thenReturn(Optional.of(primary));

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/user?id=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(1L, u);
    verify(coursesRepository, times(1)).findByPsIdAndEnrollCd(1L, "08896");
    verify(coursesRepository, times(1)).delete(primary);
    Map<String, Object> json = responseToJson(response);
    assertEquals("PSCourse with id 1 deleted", json.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__delete_course__primary_with_no_secondary()
      throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    PSCourse primary = PSCourse.builder().enrollCd("08896").psId(1L).user(u).id(1L).build();

    when(coursesRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(primary));
    when(ucsbCurriculumService.getAllSections(eq("08896"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC291A);
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(ps));
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("08896")))
        .thenReturn(Optional.of(primary));

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/user?id=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(1L, u);
    verify(personalScheduleRepository, times(1)).findByIdAndUser(1L, u);
    verify(coursesRepository, times(1)).delete(primary);
    Map<String, Object> json = responseToJson(response);
    assertEquals("PSCourse with id 1 deleted", json.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__delete_course__primary_with_secondary()
      throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    PSCourse primary = PSCourse.builder().enrollCd("63370").psId(1L).user(u).id(1L).build();
    PSCourse secondary = PSCourse.builder().enrollCd("63388").psId(1L).user(u).id(2L).build();

    when(coursesRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(primary));
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(ps));
    when(ucsbCurriculumService.getAllSections(eq("63370"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC100);
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("63370")))
        .thenReturn(Optional.of(primary));
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("63388")))
        .thenReturn(Optional.of(secondary));

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/user?id=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(1L, u);
    verify(personalScheduleRepository, times(1)).findByIdAndUser(1L, u);
    verify(ucsbCurriculumService, times(1)).getAllSections("63370", "20221");
    verify(coursesRepository, times(1)).delete(primary);
    verify(coursesRepository, times(1)).delete(secondary);
    Map<String, Object> json = responseToJson(response);
    assertEquals(
        "PSCourse with id 1 and matching secondary with id 2 deleted", json.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__delete_course__secondary_with_primary()
      throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    PSCourse primary = PSCourse.builder().enrollCd("63370").psId(1L).user(u).id(1L).build();
    PSCourse secondary = PSCourse.builder().enrollCd("63388").psId(1L).user(u).id(2L).build();

    when(coursesRepository.findByIdAndUser(eq(2L), eq(u))).thenReturn(Optional.of(secondary));
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(ps));
    when(ucsbCurriculumService.getAllSections(eq("63388"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC100);
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("63370")))
        .thenReturn(Optional.of(primary));
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("63388")))
        .thenReturn(Optional.of(secondary));

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/user?id=2").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(2L, u);
    verify(personalScheduleRepository, times(1)).findByIdAndUser(1L, u);
    verify(ucsbCurriculumService, times(1)).getAllSections("63388", "20221");
    verify(coursesRepository, times(1)).delete(primary);
    verify(coursesRepository, times(1)).delete(secondary);
    Map<String, Object> json = responseToJson(response);
    assertEquals("PSCourse with id 2 and matching primary with id 1 deleted", json.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__delete_course__primary_with_multiple_secondaries()
      throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    PersonalSchedule ps =
        PersonalSchedule.builder()
            .name("Test")
            .description("Test")
            .quarter("20221")
            .user(u)
            .id(1L)
            .build();
    PSCourse primary = PSCourse.builder().enrollCd("08292").psId(1L).user(u).id(1L).build();
    PSCourse secondary = PSCourse.builder().enrollCd("08300").psId(1L).user(u).id(2L).build();

    when(coursesRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(primary));
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(ps));
    when(ucsbCurriculumService.getAllSections(eq("08292"), eq("20221")))
        .thenReturn(SectionFixtures.SECTION_JSON_CMPSC156_UNEXPECTED);
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("08292")))
        .thenReturn(Optional.of(primary));
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("08300")))
        .thenReturn(Optional.of(secondary));
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("08318"))).thenReturn(Optional.empty());
    when(coursesRepository.findByPsIdAndEnrollCd(eq(1L), eq("08326"))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/user?id=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(1L, u);
    verify(personalScheduleRepository, times(1)).findByIdAndUser(1L, u);
    verify(ucsbCurriculumService, times(1)).getAllSections("08292", "20221");
    verify(coursesRepository, times(1)).delete(primary);
    verify(coursesRepository, times(1)).delete(secondary);
    Map<String, Object> json = responseToJson(response);
    assertEquals(
        "PSCourse with id 1 and matching secondary with id 2 deleted", json.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__delete_course_that_does_not_exist() throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    when(coursesRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/user?id=1").with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(1L, u);
    Map<String, Object> json = responseToJson(response);
    assertEquals("PSCourse with id 1 not found", json.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void
      api_courses__user_logged_in__delete_course_with_personal_schedule_that_does_not_exist()
          throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    PSCourse course = PSCourse.builder().enrollCd("00000").psId(1L).user(u).id(1L).build();
    when(coursesRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.of(course));
    when(personalScheduleRepository.findByIdAndUser(eq(1L), eq(u))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/user?id=1").with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(1L, u);
    verify(personalScheduleRepository, times(1)).findByIdAndUser(1L, u);
    Map<String, Object> json = responseToJson(response);
    assertEquals("PersonalSchedule with id 1 not found", json.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__cannot_delete_delete_belonging_to_another_user()
      throws Exception {
    // arrange
    User u = currentUserService.getCurrentUser().getUser();
    User otherUser = User.builder().id(98L).build();
    PSCourse ps1 = PSCourse.builder().enrollCd("08250").psId(13L).user(otherUser).id(31L).build();
    when(coursesRepository.findById(eq(31L))).thenReturn(Optional.of(ps1));

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/user?id=31").with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(31L, u);
    Map<String, Object> json = responseToJson(response);
    assertEquals("PSCourse with id 31 not found", json.get("message"));
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void api_courses__admin_logged_in__delete_course() throws Exception {
    // arrange

    User otherUser = User.builder().id(98L).build();
    PSCourse ps1 = PSCourse.builder().enrollCd("08250").psId(13L).user(otherUser).id(16L).build();
    when(coursesRepository.findById(eq(16L))).thenReturn(Optional.of(ps1));

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/admin?id=16").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findById(16L);
    verify(coursesRepository, times(1)).delete(ps1);
    Map<String, Object> output = responseToJson(response);
    assertEquals("PSCourse with id 16 deleted", output.get("message"));
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void api_courses__admin_logged_in__cannot_delete_course_that_does_not_exist()
      throws Exception {
    // arrange

    when(coursesRepository.findById(eq(17L))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/courses/admin?id=17").with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findById(17L);
    Map<String, Object> output = responseToJson(response);
    assertEquals("PSCourse with id 17 not found", output.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__put_course() throws Exception {
    // arrange

    User u = currentUserService.getCurrentUser().getUser();
    User otherUser = User.builder().id(999).build();
    PSCourse ps1 = PSCourse.builder().enrollCd("08250").psId(13L).user(u).id(67L).build();
    // We deliberately set the user information to another user
    // This should get ignored and overwritten with current user when todo is saved

    PSCourse updatedCourses =
        PSCourse.builder().enrollCd("08276").psId(14L).user(otherUser).id(67L).build();
    PSCourse correctCourses =
        PSCourse.builder().enrollCd("08276").psId(14L).user(u).id(67L).build();

    String requestBody = mapper.writeValueAsString(updatedCourses);
    String expectedReturn = mapper.writeValueAsString(correctCourses);

    when(coursesRepository.findByIdAndUser(eq(67L), eq(u))).thenReturn(Optional.of(ps1));

    // act
    MvcResult response =
        mockMvc
            .perform(
                put("/api/courses/user?id=67")
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8")
                    .content(requestBody)
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(67L, u);
    verify(coursesRepository, times(1)).save(correctCourses); // should be saved with correct user
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedReturn, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__cannot_put_course_that_does_not_exist()
      throws Exception {
    // arrange

    User u = currentUserService.getCurrentUser().getUser();
    PSCourse updatedCourses = PSCourse.builder().enrollCd("08276").psId(14L).id(67L).build();

    String requestBody = mapper.writeValueAsString(updatedCourses);

    when(coursesRepository.findByIdAndUser(eq(67L), eq(u))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(
                put("/api/courses/user?id=67")
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8")
                    .content(requestBody)
                    .with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(67L, u);
    Map<String, Object> output = responseToJson(response);
    assertEquals("PSCourse with id 67 not found", output.get("message"));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_courses__user_logged_in__cannot_put_course_for_another_user() throws Exception {
    // arrange

    User u = currentUserService.getCurrentUser().getUser();
    User otherUser = User.builder().id(98L).build();
    PSCourse ps1 = PSCourse.builder().enrollCd("08250").psId(13L).user(otherUser).id(31L).build();
    PSCourse updatedCourses = PSCourse.builder().enrollCd("08276").psId(14L).id(31L).build();

    when(coursesRepository.findByIdAndUser(eq(31L), eq(otherUser))).thenReturn(Optional.of(ps1));

    String requestBody = mapper.writeValueAsString(updatedCourses);

    // act
    MvcResult response =
        mockMvc
            .perform(
                put("/api/courses/user?id=31")
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8")
                    .content(requestBody)
                    .with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findByIdAndUser(31L, u);
    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("PSCourse with id 31 not found", json.get("message"));
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void api_schedules__admin_logged_in__put_schedule() throws Exception {
    // arrange

    User otherUser = User.builder().id(255L).build();
    PSCourse ps1 = PSCourse.builder().enrollCd("08250").psId(13L).user(otherUser).id(77L).build();
    User yetAnotherUser = User.builder().id(512L).build();
    // We deliberately put the wrong user on the updated course
    // We expect the controller to ignore this and keep the user the same
    PSCourse updatedCourses =
        PSCourse.builder().enrollCd("08276").psId(14L).user(yetAnotherUser).id(77L).build();
    PSCourse correctCourses =
        PSCourse.builder().enrollCd("08276").psId(14L).user(otherUser).id(77L).build();

    String requestBody = mapper.writeValueAsString(updatedCourses);
    String expectedJson = mapper.writeValueAsString(correctCourses);

    when(coursesRepository.findById(eq(77L))).thenReturn(Optional.of(ps1));

    // act
    MvcResult response =
        mockMvc
            .perform(
                put("/api/courses/admin?id=77")
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8")
                    .content(requestBody)
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findById(77L);
    verify(coursesRepository, times(1)).save(correctCourses);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void api_courses__admin_logged_in__cannot_put_course_that_does_not_exist()
      throws Exception {
    // arrange

    User otherUser = User.builder().id(345L).build();
    PSCourse updatedCourses =
        PSCourse.builder().enrollCd("08250").psId(13L).user(otherUser).id(77L).build();

    String requestBody = mapper.writeValueAsString(updatedCourses);

    when(coursesRepository.findById(eq(77L))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(
                put("/api/courses/admin?id=77")
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8")
                    .content(requestBody)
                    .with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    verify(coursesRepository, times(1)).findById(77L);
    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("PSCourse with id 77 not found", json.get("message"));
  }
}
