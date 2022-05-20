package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.repositories.UserRepository;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(value = UCSBCurriculumController.class)
@Import(SecurityConfig.class)
public class UCSBCurriculumControllerTests {
    private final Logger logger = LoggerFactory.getLogger(UCSBCurriculumControllerTests.class);
    private ObjectMapper mapper = new ObjectMapper();

    @MockBean
    UserRepository userRepository;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UCSBCurriculumService ucsbCurriculumService;

    @Test
    public void test_search() throws Exception {

        String expectedResult = "{expectedJSONResult}";
        String urlTemplate = "/api/public/basicsearch?qtr=%s&dept=%s&level=%s";
        String url = String.format(urlTemplate, "20204", "CMPSC", "L");
        when(ucsbCurriculumService.getJSON(any(String.class), any(String.class), any(String.class)))
                .thenReturn(expectedResult);

        MvcResult response = mockMvc.perform(get(url).contentType("application/json")).andExpect(status().isOk())
                .andReturn();
        String responseString = response.getResponse().getContentAsString();

        assertEquals(expectedResult, responseString);
    }
}
