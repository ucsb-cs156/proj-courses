package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import edu.ucsb.cs156.courses.entities.GradeHistory;
import edu.ucsb.cs156.courses.fixtures.GradeHistoryFixtures;

@RestClientTest(UCSBGradeHistoryServiceImpl.class)
@AutoConfigureDataJpa
public class UCSBGradeHistoryServiceTests {

    @Autowired
    private MockRestServiceServer mockRestServiceServer;

    @Mock
    private RestTemplate restTemplate;

    @Autowired
    private UCSBGradeHistoryService ucsbGradeHistoryService;

    @Test
    public void test_getUrls() throws Exception {
        String expectedURL = UCSBGradeHistoryServiceImpl.API_ENDPOINT;

        List<String> EXPECTED_URLS = new ArrayList<String>();
        EXPECTED_URLS.add("https://raw.githubusercontent.com/ucsb-cs156/UCSB_Grades/main/quarters/F09/ANTH.csv");

        this.mockRestServiceServer.expect(requestTo(expectedURL))
                .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
                .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
                .andRespond(withSuccess(GradeHistoryFixtures.GITHUB_API_SAMPLE_JSON, MediaType.APPLICATION_JSON));

        List<String> result = ucsbGradeHistoryService.getUrls();

        assertEquals(EXPECTED_URLS, result);
    }

    @Test
    public void test_getGradeData() throws Exception {
        String url = "https://example.org/getGradeData";

        List<GradeHistory> expectedResult = new ArrayList<GradeHistory>();
        expectedResult.add(
            GradeHistory.builder()
            .yyyyq("20094")
            .course("DANCE    47A")
            .instructor("HUSTON V G")
            .grade("A-")
            .count(3)
            .build());
        expectedResult.add(
                GradeHistory.builder()
                .yyyyq("20094")
                .course("DANCE    47A")
                .instructor("HUSTON V G")
                .grade("C+")
                .count(1)
                .build());
        expectedResult.add(
                    GradeHistory.builder()
                    .yyyyq("20094")
                    .course("DANCE    51")
                    .instructor("STUNKEL M C")
                    .grade("A")
                    .count(8)
                    .build());
        expectedResult.add(
                        GradeHistory.builder()
                        .yyyyq("20094")
                        .course("DANCE    51")
                        .instructor("STUNKEL M C")
                        .grade("B-")
                        .count(1)
                        .build());

        this.mockRestServiceServer.expect(requestTo(url))
                .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
                .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
                .andRespond(withSuccess(GradeHistoryFixtures.SAMPLE_CSV_FILE_CONTENTS, MediaType.APPLICATION_JSON));

        List<GradeHistory> actualResult = ucsbGradeHistoryService.getGradeData(url);

        assertEquals(expectedResult, actualResult);
    }



}