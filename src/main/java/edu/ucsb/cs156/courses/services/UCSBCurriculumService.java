package edu.ucsb.cs156.courses.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.Course;
import edu.ucsb.cs156.courses.documents.CourseInfo;
import edu.ucsb.cs156.courses.documents.CoursePage;
import edu.ucsb.cs156.courses.documents.Section;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.util.UriComponentsBuilder;
import java.util.Map;
import java.util.HashMap;

import java.io.*;

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

    private RestTemplate restTemplate = new RestTemplate();

    public UCSBCurriculumService(RestTemplateBuilder restTemplateBuilder) {
        restTemplate = restTemplateBuilder.build();
    }

    public static final String CURRICULUM_ENDPOINT = "https://api.ucsb.edu/academics/curriculums/v1/classes/search";

    public static final String SUBJECTS_ENDPOINT = "https://api.ucsb.edu/students/lookups/v1/subjects";

    public static final String SECTION_ENDPOINT = "https://api.ucsb.edu/academics/curriculums/v1/classsection/{quarter}/{enrollcode}";

    public String getJSON(String subjectArea, String quarter, String courseLevel) {

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("ucsb-api-version", "1.0");
        headers.set("ucsb-api-key", this.apiKey);

        HttpEntity<String> entity = new HttpEntity<>("body", headers);

        String params = String.format(
                "?quarter=%s&subjectCode=%s&objLevelCode=%s&pageNumber=%d&pageSize=%d&includeClassSections=%s", quarter,
                subjectArea, courseLevel, 1, 100, "true");
        String url = CURRICULUM_ENDPOINT + params;

        if (courseLevel.equals("A")) {
            params = String.format(
                    "?quarter=%s&subjectCode=%s&pageNumber=%d&pageSize=%d&includeClassSections=%s",
                    quarter, subjectArea, 1, 100, "true");
            url = CURRICULUM_ENDPOINT + params;
        }

        log.info("url=" + url);

        String retVal = "";
        MediaType contentType = null;
        HttpStatus statusCode = null;
        try {
            ResponseEntity<String> re = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            contentType = re.getHeaders().getContentType();
            statusCode = re.getStatusCode();
            retVal = re.getBody();
        } catch (HttpClientErrorException e) {
            retVal = "{\"error\": \"401: Unauthorized\"}";
        }
        log.info("json: {} contentType: {} statusCode: {}", retVal, contentType, statusCode);
        return retVal;
    }

    public List<ConvertedSection> getConvertedSections(String subjectArea, String quarter, String courseLevel)
            throws JsonProcessingException {
        String json = getJSON(subjectArea, quarter, courseLevel);
        CoursePage coursePage = objectMapper.readValue(json, CoursePage.class);
        List<ConvertedSection> result = coursePage.convertedSections();       
        return result;
    }

    public String getSectionJSON(String subjectArea, String quarter, String courseLevel)
        throws JsonProcessingException {
        List<ConvertedSection> l = getConvertedSections(subjectArea, quarter, courseLevel);
        
        String arrayToJson = objectMapper.writeValueAsString(l);
    
        return arrayToJson;
    }
    
    public String getSubjectsJSON() {

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("ucsb-api-version", "1.0");
        headers.set("ucsb-api-key", this.apiKey);

        HttpEntity<String> entity = new HttpEntity<>("body", headers);

        log.info("url=" + SUBJECTS_ENDPOINT);

        String retVal = "";
        MediaType contentType = null;
        HttpStatus statusCode = null;
        try {
            ResponseEntity<String> re = restTemplate.exchange(SUBJECTS_ENDPOINT, HttpMethod.GET, entity, String.class);
            contentType = re.getHeaders().getContentType();
            statusCode = re.getStatusCode();
            retVal = re.getBody();
        } catch (HttpClientErrorException e) {
            retVal = "{\"error\": \"401: Unauthorized\"}";
        }
        log.info("json: {} contentType: {} statusCode: {}", retVal, contentType, statusCode);
        return retVal;
    }

    public String getSection(String enrollCode, String quarter) {

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("ucsb-api-version", "1.0");
        headers.set("ucsb-api-key", this.apiKey);

        HttpEntity<String> entity = new HttpEntity<>("body", headers);

        String url = SECTION_ENDPOINT;


        log.info("url=" + url);

        String urlTemplate = UriComponentsBuilder.fromHttpUrl(url)
        .queryParam("quarter", "{quarter}")
        .queryParam("enrollcode", "{enrollcode}")
        .encode()
        .toUriString();

        Map<String, String> params = new HashMap<>();
        params.put("quarter", quarter);
        params.put("enrollcode", enrollCode);

        String retVal = "";
        MediaType contentType = null;
        HttpStatus statusCode = null;
        try {
            ResponseEntity<String> re = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, params);
            contentType = re.getHeaders().getContentType();
            statusCode = re.getStatusCode();
            retVal = re.getBody();
        } catch (HttpClientErrorException e) {
            retVal = "{\"error\": \"401: Unauthorized\"}";
        }

        if(retVal.equals("null")){
            retVal = "{\"error\": \"Enroll code doesn't exist in that quarter.\"}";
        }

        log.info("json: {} contentType: {} statusCode: {}", retVal, contentType, statusCode);
        return retVal;
    }
     

    public String getJSONbyQtrEnrollCd(String quarter, String enrollCd) {

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("ucsb-api-version", "1.0");
        headers.set("ucsb-api-key", this.apiKey);

        HttpEntity<String> entity = new HttpEntity<>("body", headers);


        String url = "https://api.ucsb.edu/academics/curriculums/v3/classsection/" + quarter + "/" + enrollCd;

        log.info("url=" + url);

        String retVal = "";
        MediaType contentType = null;
        HttpStatus statusCode = null;
        try {
            ResponseEntity<String> re = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            contentType = re.getHeaders().getContentType();
            statusCode = re.getStatusCode();
            retVal = re.getBody();
        } catch (HttpClientErrorException e) {
            retVal = "{\"error\": \"401: Unauthorized\"}";
        }
        log.info("json: {} contentType: {} statusCode: {}", retVal, contentType, statusCode);
        return retVal;

    }

}
