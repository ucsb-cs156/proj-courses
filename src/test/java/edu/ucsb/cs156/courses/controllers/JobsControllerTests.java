package edu.ucsb.cs156.courses.controllers;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.jobs.UpdateCourseDataJobFactory;
import edu.ucsb.cs156.courses.jobs.UploadGradeDataJobFactory;
import edu.ucsb.cs156.courses.repositories.JobsRepository;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.UCSBSubjectsService;
import edu.ucsb.cs156.courses.services.jobs.JobService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

@Slf4j
@WebMvcTest(controllers = JobsController.class)
@Import(JobService.class)
@AutoConfigureDataJpa
public class JobsControllerTests extends ControllerTestCase {

  @MockBean JobsRepository jobsRepository;

  @MockBean UserRepository userRepository;

  @MockBean UploadGradeDataJobFactory uploadGradeDataJobFactory;

  @Autowired JobService jobService;

  @Autowired ObjectMapper objectMapper;

  @MockBean UCSBSubjectsService ucsbSubjectsService;

  @MockBean UCSBCurriculumService ucsbCurriculumService;

  @MockBean UpdateCourseDataJobFactory updateCourseDataJobFactory;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_get_all_jobs() throws Exception {

    // arrange

    Job job1 = Job.builder().log("this is job 1").build();
    Job job2 = Job.builder().log("this is job 2").build();

    ArrayList<Job> expectedJobs = new ArrayList<>();
    expectedJobs.addAll(Arrays.asList(job1, job2));

    when(jobsRepository.findAll()).thenReturn(expectedJobs);

    // act
    MvcResult response =
        mockMvc.perform(get("/api/jobs/all")).andExpect(status().isOk()).andReturn();

    // // assert

    verify(jobsRepository, times(1)).findAll();
    String expectedJson = mapper.writeValueAsString(expectedJobs);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_delete_all_jobs() throws Exception {

    doNothing().when(jobsRepository).deleteAll();

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/jobs/all").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert

    verify(jobsRepository, times(1)).deleteAll();
    String expectedJson = mapper.writeValueAsString(Map.of("message", "All jobs deleted"));
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_delete_specific_job() throws Exception {

    // arrange

    when(jobsRepository.existsById(eq(1L))).thenReturn(true);
    doNothing().when(jobsRepository).deleteById(eq(1L));

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/jobs?id=1").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert

    verify(jobsRepository, times(1)).deleteById(eq(1L));
    String expectedJson = mapper.writeValueAsString(Map.of("message", "Job with id 1 deleted"));
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_gets_reasonable_error_when_deleting_non_existing_job() throws Exception {

    // arrange

    when(jobsRepository.existsById(eq(2L))).thenReturn(false);

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/jobs?id=2").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert

    verify(jobsRepository, times(1)).existsById(eq(2L));
    String expectedJson = mapper.writeValueAsString(Map.of("message", "Job with id 2 not found"));
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_test_job() throws Exception {

    // arrange

    User user = currentUserService.getUser();

    String logContents1 = 
        """
        Hello World! from test job!
        testing logNoCR testlogNoCR2 testlogNoCR3
        authentication is not null
        """;

    Job jobStarted =
        Job.builder()
            .id(0L)
            .createdBy(user)
            .createdAt(null)
            .updatedAt(null)
            .status("running")
            .log(logContents1)
            .build();

    String logContents2 = 
        """
        Hello World! from test job!
        testing logNoCR testlogNoCR2 testlogNoCR3
        authentication is not null
        Goodbye from test job!
        """;

    Job jobCompleted =
        Job.builder()
            .id(0L)
            .createdBy(user)
            .createdAt(null)
            .updatedAt(null)
            .status("complete")
            .log(logContents2)
            .build();

    when(jobsRepository.save(any(Job.class))).thenReturn(jobStarted).thenReturn(jobCompleted);

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=2000").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertEquals("running", jobReturned.getStatus());

    await()
        .atMost(1, SECONDS)
        .untilAsserted(() -> verify(jobsRepository, times(6)).save(eq(jobStarted)));
    await()
        .atMost(10, SECONDS)
        .untilAsserted(() -> verify(jobsRepository, times(8)).save(eq(jobCompleted)));
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_test_job_that_fails() throws Exception {

    // arrange

    User user = currentUserService.getUser();

    String logContents1 = 
        """
        Hello World! from test job!
        testing logNoCR testlogNoCR2 testlogNoCR3
        authentication is not null
        """;

    Job jobStarted =
        Job.builder()
            .id(0L)
            .createdBy(user)
            .createdAt(null)
            .updatedAt(null)
            .status("running")
            .log(logContents1)
            .build();

    String logContents2 = 
        """
        Hello World! from test job!
        testing logNoCR testlogNoCR2 testlogNoCR3
        authentication is not null
        Fail!
        """;
    Job jobFailed =
        Job.builder()
            .id(0L)
            .createdBy(user)
            .createdAt(null)
            .updatedAt(null)
            .status("error")
            .log(logContents2)
            .build();

    when(jobsRepository.save(any(Job.class))).thenReturn(jobStarted).thenReturn(jobFailed);

    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/jobs/launch/testjob?fail=true&sleepMs=4000").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    String responseString = response.getResponse().getContentAsString();
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertEquals("running", jobReturned.getStatus());

    await()
        .atMost(1, SECONDS)
        .untilAsserted(() -> verify(jobsRepository, times(6)).save(eq(jobStarted)));

    await()
        .atMost(10, SECONDS)
        .untilAsserted(() -> verify(jobsRepository, times(7)).save(eq(jobFailed)));
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_update_courses_job() throws Exception {
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
    log.trace("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_update_courses_job_with_quarter() throws Exception {
    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/jobs/launch/updateQuarterCourses?quarterYYYYQ=20231").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    log.trace("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_update_courses_range_of_quarters_job() throws Exception {
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
    log.trace("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_update_courses_range_of_quarters_single_subject_job()
      throws Exception {
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
    log.trace("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }

  @WithMockUser(roles = {"ADMIN"})
  @Test
  public void admin_can_launch_upload_course_grade_data_job() throws Exception {
    // act
    MvcResult response =
        mockMvc
            .perform(post("/api/jobs/launch/uploadGradeData").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    log.trace("responseString={}", responseString);
    Job jobReturned = objectMapper.readValue(responseString, Job.class);

    assertNotNull(jobReturned.getStatus());
  }
}
