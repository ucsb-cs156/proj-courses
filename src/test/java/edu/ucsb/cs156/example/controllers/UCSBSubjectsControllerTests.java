package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBSubject;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.repositories.UCSBSubjectRepository;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.memory.UserAttributeEditor;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;


@WebMvcTest(controllers = UCSBSubjectsController.class)
@Import(TestConfig.class)
public class UCSBSubjectsControllerTests extends ControllerTestCase {

    @MockBean
    UCSBSubjectRepository ucsbSubjectRepository;

    @MockBean
    UserRepository userRepository;

    @Test
    public void api_UCSBSubjects_all__logged_out__returns_403() throws Exception {
        mockMvc.perform(get("/api/UCSBSubjects/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_UCSBSubjects_all__user_logged_in__returns_200() throws Exception {
        mockMvc.perform(get("/api/UCSBSubjects/all"))
                .andExpect(status().isOk());
    }

    // Tests with mocks for database actions

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_UCSBSubjects__user_logged_in__returns_a_subject_that_exists() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();

        UCSBSubject us = UCSBSubject.builder()
                .subjectCode("ANTH")
                .subjectTranslation("Anthropology")
                .deptCode("ANTH")
                .collegeCode("L&S")
                .relatedDeptCode(null)
                .inactive(false)
                .id(7L)
                .build();

        when(ucsbSubjectRepository.findById(eq(7L))).thenReturn(Optional.of(us));

        // act
        MvcResult response = mockMvc.perform(get("/api/UCSBSubjects?id=7"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(ucsbSubjectRepository, times(1)).findById(7L);
        String expectedJson = mapper.writeValueAsString(us);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_todos__user_logged_in__search_for_id_that_does_not_exist() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();

        when(ucsbSubjectRepository.findById(eq(7L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/UCSBSubjects?id=7"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(ucsbSubjectRepository, times(1)).findById(7L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UCSBSubject with id 7 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void search_for_id_that_does_not_exist() throws Exception {

        // arrange

        when(ucsbSubjectRepository.findById(eq(29L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/UCSBSubjects?id=29"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(ucsbSubjectRepository, times(1)).findById(29L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UCSBSubject with id 29 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void api_todos_admin_all__admin_logged_in__returns_all_records() throws Exception {

        // arrange

        UCSBSubject us1 = UCSBSubject.builder()
                .subjectCode("ANTH")
                .subjectTranslation("Anthropology")
                .deptCode("ANTH")
                .collegeCode("L&S")
                .relatedDeptCode(null)
                .inactive(false)
                .id(7L)
                .build();

        UCSBSubject us2 = UCSBSubject.builder()
                .subjectCode("ART  CS")
                .subjectTranslation("Art (Creative Studies)")
                .deptCode("CRSTU")
                .collegeCode("CRST")
                .relatedDeptCode(null)
                .inactive(false)
                .id(8L)
                .build();

        UCSBSubject us3 = UCSBSubject.builder()
                .subjectCode("CH E")
                .subjectTranslation("Chemical Engineering")
                .deptCode("CNENG")
                .collegeCode("ENGR")
                .relatedDeptCode(null)
                .inactive(false)
                .id(9L)
                .build();

        ArrayList<UCSBSubject> expectedUSs = new ArrayList<>();
        expectedUSs.addAll(Arrays.asList(us1, us2, us3));

        when(ucsbSubjectRepository.findAll()).thenReturn(expectedUSs);

        // act
        MvcResult response = mockMvc.perform(get("/api/UCSBSubjects/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(ucsbSubjectRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedUSs);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void api_todos__user_logged_in__delete_by_id() throws Exception {
        // arrange

        UCSBSubject us1 = UCSBSubject.builder()
                .subjectCode("ANTH")
                .subjectTranslation("Anthropology")
                .deptCode("ANTH")
                .collegeCode("L&S")
                .relatedDeptCode(null)
                .inactive(false)
                .id(15L)
                .build();

        when(ucsbSubjectRepository.findById(eq(15L))).thenReturn(Optional.of(us1));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/UCSBSubjects?id=15")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbSubjectRepository, times(1)).findById(15L);
        verify(ucsbSubjectRepository, times(1)).delete(us1);
        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBSubject with id 15 deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void api_todos__user_logged_in__delete_by_id_that_does_not_exist() throws Exception {
        // arrange

        when(ucsbSubjectRepository.findById(eq(15L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/UCSBSubjects?id=15")
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(ucsbSubjectRepository, times(1)).findById(15L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBSubject with id 15 not found", json.get("message"));
    }


    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void api_todos__admin_logged_in__delete_all() throws Exception {
        // arrange

        doNothing().when(ucsbSubjectRepository).deleteAll();

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/UCSBSubjects/all")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbSubjectRepository, times(1)).deleteAll();
        Map<String, Object> json = responseToJson(response);
        assertEquals("All UCSBSubject records deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void api_UCSBSubjects_load_returns_200() throws Exception {

        // TODO: mock the service that gets a list of subjects
        // from the UCSB Developer API, and the list of subjects
        // returned from that service.

        // TODO: Mock the storing in the database of those records.

        List<UCSBSubject> expectedUSs = new ArrayList<UCSBSubject>();

        MvcResult response = mockMvc.perform(post("/api/UCSBSubjects/load")
                .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // TODO: Verify that the service was called
        // and that the records were stored in the database,
        // and that the JSON returned matches the JSON for those
        // records.

        String expectedJson = mapper.writeValueAsString(expectedUSs);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

}