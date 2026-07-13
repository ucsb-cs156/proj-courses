package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.jobs.UpdateCourseDataJobFactory;
import edu.ucsb.cs156.courses.jobs.UploadGradeDataJobFactory;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.UCSBSubjectsService;
import edu.ucsb.cs156.jobs.entities.Job;
import edu.ucsb.cs156.jobs.services.JobService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Tests for this app's JobsController: launching jobs. The generic endpoints (list, paginated,
 * logs, delete) belong to the lib-jobs library controller and are tested in the library.
 *
 * @see JobsController
 */
@Slf4j
@WebMvcTest(controllers = JobsController.class)
public class JobsControllerTests extends ControllerTestCase {

  @MockBean UploadGradeDataJobFactory uploadGradeDataJobFactory;

  // required for context load: JobsController extends ApiController, which
  // depends on CurrentUserService, which depends on this repository - even
  // though none of the launch endpoints below call getCurrentUser()
  @MockBean UserRepository userRepository;

  @MockBean JobService jobService;

  @Autowired ObjectMapper objectMapper;

  @MockBean UCSBSubjectsService ucsbSubjectsService;

  @MockBean UCSBCurriculumService ucsbCurriculumService;

  @MockBean UpdateCourseDataJobFactory updateCourseDataJobFactory;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_update_courses_job() throws Exception {
    // arrange
    Job job = Job.builder().id(1L).status("started").build();
    when(jobService.runAsJob(any())).thenReturn(job);

    // act
    MvcResult response =
        mockMvc
            .perform(
                post("/api/jobs/launch/updateCourses?quarterYYYYQ=20231&subjectArea=CMPSC")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    log.info("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_update_courses_job_with_quarter() throws Exception {
    // arrange
    Job job = Job.builder().id(1L).status("started").build();
    when(jobService.runAsJob(any())).thenReturn(job);

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/jobs/launch/updateQuarterCourses?quarterYYYYQ=20231").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    log.info("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_update_courses_range_of_quarters_job() throws Exception {
    // arrange
    Job job = Job.builder().id(1L).status("started").build();
    when(jobService.runAsJob(any())).thenReturn(job);

    // act
    MvcResult response =
        mockMvc
            .perform(
                post("/api/jobs/launch/updateCoursesRangeOfQuarters?start_quarterYYYYQ=20221&end_quarterYYYYQ=20222")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    log.info("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_update_courses_range_of_quarters_single_subject_job()
      throws Exception {
    // arrange
    Job job = Job.builder().id(1L).status("started").build();
    when(jobService.runAsJob(any())).thenReturn(job);

    // act
    MvcResult response =
        mockMvc
            .perform(
                post("/api/jobs/launch/updateCoursesRangeOfQuartersSingleSubject?subjectArea=CMPSC&start_quarterYYYYQ=20221&end_quarterYYYYQ=20222")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    log.info("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_upload_course_grade_data_job() throws Exception {
    // arrange
    Job job = Job.builder().id(1L).status("started").build();
    when(jobService.runAsJob(any())).thenReturn(job);

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/jobs/launch/uploadGradeData").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    log.info("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_test_job() throws Exception {
    // arrange
    Job job = Job.builder().id(1L).status("started").build();
    when(jobService.runAsJob(any())).thenReturn(job);

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=2000").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    log.info("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void regular_users_cannot_launch_test_job() throws Exception {
    mockMvc
        .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=0").with(csrf()))
        .andExpect(status().is(403));
  }
}
