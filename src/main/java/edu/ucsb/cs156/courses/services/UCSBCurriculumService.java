package edu.ucsb.cs156.courses.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CoursePage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

/**
 * Service object that wraps the UCSB Academic Curriculum API
 */
@Service
@Slf4j
public class UCSBCurriculumService {

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${app.ucsb.api.consumer_key}")
    private String apiKey;

    private RestTemplate restTemplate;

    public UCSBCurriculumService(RestTemplateBuilder restTemplateBuilder) {
        restTemplate = restTemplateBuilder.build();
    }

    public static final String SEARCH_ENDPOINT = "https://api.ucsb.edu/academics/curriculums/v3/classes/search";
    public static final String SECTION_ENDPOINT = "https://api.ucsb.edu/academics/curriculums/v3/classsection/{quarter}/{enrollcode}";
    public static final String ALL_SECTIONS_ENDPOINT = "https://api.ucsb.edu/academics/curriculums/v3/classes/{quarter}/{enrollcode}";

    private String runEndpoint(String url, Object... uriVariables) {
        log.info("url=" + url);

        var headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        // currently all endpoints use version 3.0
        headers.set("ucsb-api-version", "3.0");
        headers.set("ucsb-api-key", this.apiKey);
        var entity = new HttpEntity<>("", headers);

        String retVal;
        HttpStatus statusCode = null;
        try {
            ResponseEntity<String> re = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, uriVariables);
            statusCode = re.getStatusCode();
            retVal = re.getBody();
        } catch (HttpClientErrorException e) {
            retVal = "{\"error\": \"401: Unauthorized\"}";
        }
        log.info("json: {} statusCode: {}", retVal, statusCode);
        return retVal;
    }

    private static String getCourseSearchUrl(String subjectArea, String quarter, String courseLevel) {
        String params;
        if (courseLevel.equals("A")) {
            params = String.format(
                "?quarter=%s&subjectCode=%s&pageNumber=%d&pageSize=%d&includeClassSections=%s",
                quarter, subjectArea, 1, 100, "true");
        } else {
            params = String.format(
                "?quarter=%s&subjectCode=%s&objLevelCode=%s&pageNumber=%d&pageSize=%d&includeClassSections=%s", quarter,
                subjectArea, courseLevel, 1, 100, "true");
        }
        return SEARCH_ENDPOINT + params;
    }

    /**
     * This returns the json as returned by the UCSB API endpoint.
     * This method may be removed in the future.
     */
    public String searchForCoursesUcsbApi(String subjectArea, String quarter, String courseLevel) {
        String url = getCourseSearchUrl(subjectArea, quarter, courseLevel);
        return runEndpoint(url);
    }

    public List<ConvertedSection> searchForCourses(String subjectArea, String quarter, String courseLevel)
        throws JsonProcessingException {
        String json = searchForCoursesUcsbApi(subjectArea, quarter, courseLevel);
        CoursePage coursePage = objectMapper.readValue(json, CoursePage.class);
        return coursePage.convertedSections();
    }

    private String runSectionEndpoint(
        String url,
        String quarter,
        String enrollCode) {
        String retVal = runEndpoint(url, quarter, enrollCode);
        if (retVal.equals("null")) {
            retVal = "{\"error\": \"Enroll code doesn't exist in that quarter.\"}";
        }
        return retVal;
    }

    /**
     * This method retrieves exactly one section matching the
     *  enrollCode and quarter arguments, if such a section exists.
     */
    public String getSection(String enrollCode, String quarter) {
        return runSectionEndpoint(SECTION_ENDPOINT, quarter, enrollCode);
    }

    /**
     * This method retrieves all of the sections related to a certain
     *  enroll code. For example, if the enrollCode is for a discussion
     *  section, the lecture section and all related discussion sections
     *  will also be returned.
     */
    public String getAllSections(String enrollCode, String quarter) {
        return runSectionEndpoint(ALL_SECTIONS_ENDPOINT, quarter, enrollCode);
    }
}
