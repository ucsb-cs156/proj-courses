package edu.ucsb.cs156.courses.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CoursePageFixtures;
import edu.ucsb.cs156.courses.documents.SectionFixtures;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withUnauthorizedRequest;

@RestClientTest(UCSBCurriculumService.class)
@AutoConfigureDataJpa
public class UCSBCurriculumServiceTests {

    @Value("${app.ucsb.api.consumer_key}")
    private String apiKey;

    @Autowired
    private MockRestServiceServer mockRestServiceServer;

    @Mock
    private RestTemplate restTemplate;

    @Autowired
    private UCSBCurriculumService ucs;

    @Test
    public void test_searchForCoursesUcsbApi_success() {
        String expectedResult = "{expectedResult}";

        String subjectArea = "CMPSC";
        String quarter = "20201";
        String level = "L";

        String expectedParams = String.format(
            "?quarter=%s&subjectCode=%s&objLevelCode=%s&pageNumber=%d&pageSize=%d&includeClassSections=%s", quarter,
            subjectArea, level, 1, 100, "true");
        String expectedURL = UCSBCurriculumService.SEARCH_ENDPOINT + expectedParams;

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "3.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

        String result = ucs.searchForCoursesUcsbApi(subjectArea, quarter, level);

        assertEquals(expectedResult, result);
    }

    @Test
    public void test_searchForCoursesUcsbApi_level_A() {
        String expectedResult = "{expectedResult}";

        String subjectArea = "CMPSC";
        String quarter = "20201";
        String level = "A";

        String expectedParams = String.format(
            "?quarter=%s&subjectCode=%s&pageNumber=%d&pageSize=%d&includeClassSections=%s",
            quarter, subjectArea, 1, 100, "true");
        String expectedURL = UCSBCurriculumService.SEARCH_ENDPOINT + expectedParams;

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "3.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

        String result = ucs.searchForCoursesUcsbApi(subjectArea, quarter, level);

        assertEquals(expectedResult, result);
    }

    @Test
    public void test_searchForCoursesUcsbApi_unauthorized() {
        String expectedResult = "{\"error\": \"401: Unauthorized\"}";

        when(restTemplate.exchange(any(String.class), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
            .thenThrow(HttpClientErrorException.class);

        String subjectArea = "CMPSC";
        String quarter = "20201";
        String level = "L";

        String expectedParams = String.format(
            "?quarter=%s&subjectCode=%s&objLevelCode=%s&pageNumber=%d&pageSize=%d&includeClassSections=%s", quarter,
            subjectArea, level, 1, 100, "true");
        String expectedURL = UCSBCurriculumService.SEARCH_ENDPOINT + expectedParams;

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "3.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withUnauthorizedRequest());

        String result = ucs.searchForCoursesUcsbApi(subjectArea, quarter, level);

        assertEquals(expectedResult, result);
    }

    @Test
    public void test_searchForCourses() throws Exception {
        String expectedResult = CoursePageFixtures.COURSE_PAGE_JSON_MATH3B;

        String subjectArea = "MATH";
        String quarter = "20222";
        String level = "L";

        String expectedParams = String.format(
            "?quarter=%s&subjectCode=%s&objLevelCode=%s&pageNumber=%d&pageSize=%d&includeClassSections=%s", quarter,
            subjectArea, level, 1, 100, "true");
        String expectedURL = UCSBCurriculumService.SEARCH_ENDPOINT + expectedParams;

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "3.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

        ObjectMapper objectMapper = new ObjectMapper();

        List<ConvertedSection> convertedSections = ucs.searchForCourses(subjectArea, quarter, level);
        List<ConvertedSection> expected = objectMapper.readValue(CoursePageFixtures.CONVERTED_SECTIONS_JSON_MATH5B,
            new TypeReference<List<ConvertedSection>>() {
            });

        assertEquals(expected, convertedSections);
    }

    @Test
    public void test_getSection_success() {
        String expectedResult = SectionFixtures.SECTION_JSON_CMPSC165B;
        //String expectedResult = "expected Result";

        String enrollCode = "08268";
        String quarter = "20224";

        String expectedURL = UCSBCurriculumService.SECTION_ENDPOINT.replace("{quarter}", quarter).replace("{enrollcode}", enrollCode);

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "3.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

        String result = ucs.getSection(enrollCode, quarter);

        assertEquals(expectedResult, result);
    }

    @Test
    public void test_getSection_unauthorized() {
        String expectedResult = "{\"error\": \"401: Unauthorized\"}";


        String enrollCode = "08268";
        String quarter = "20224";

        String expectedURL = UCSBCurriculumService.SECTION_ENDPOINT.replace("{quarter}", quarter).replace("{enrollcode}", enrollCode);

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "3.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withUnauthorizedRequest());

        String result = ucs.getSection(enrollCode, quarter);
        assertEquals(expectedResult, result);
    }

    @Test
    public void test_getSection_not_found() {
        String expectedResult = "{\"error\": \"Enroll code doesn't exist in that quarter.\"}";


        String enrollCode = "08268";
        String quarter = "00000";

        String expectedURL = UCSBCurriculumService.SECTION_ENDPOINT.replace("{quarter}", quarter).replace("{enrollcode}", enrollCode);

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "3.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withSuccess("null", MediaType.APPLICATION_JSON));

        String result = ucs.getSection(enrollCode, quarter);
        assertEquals(expectedResult, result);
    }

    @Test
    public void test_getAllSections_success() {
        String expectedResult = SectionFixtures.SECTION_JSON_CMPSC165B;
        //String expectedResult = "expected Result";

        String enrollCode = "08268";
        String quarter = "20224";

        String expectedURL = UCSBCurriculumService.ALL_SECTIONS_ENDPOINT.replace("{quarter}", quarter).replace("{enrollcode}", enrollCode);

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "3.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

        String result = ucs.getAllSections(enrollCode, quarter);

        assertEquals(expectedResult, result);
    }

    @Test
    public void test_getAllSections_unauthorized() {
        String expectedResult = "{\"error\": \"401: Unauthorized\"}";


        String enrollCode = "08268";
        String quarter = "20224";

        String expectedURL = UCSBCurriculumService.ALL_SECTIONS_ENDPOINT.replace("{quarter}", quarter).replace("{enrollcode}", enrollCode);

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "3.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withUnauthorizedRequest());

        String result = ucs.getAllSections(enrollCode, quarter);
        assertEquals(expectedResult, result);
    }

    @Test
    public void test_getAllSections_not_found() {
        String expectedResult = "{\"error\": \"Enroll code doesn't exist in that quarter.\"}";


        String enrollCode = "08268";
        String quarter = "00000";

        String expectedURL = UCSBCurriculumService.ALL_SECTIONS_ENDPOINT.replace("{quarter}", quarter).replace("{enrollcode}", enrollCode);

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "3.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withSuccess("null", MediaType.APPLICATION_JSON));

        String result = ucs.getAllSections(enrollCode, quarter);
        assertEquals(expectedResult, result);
    }

}
