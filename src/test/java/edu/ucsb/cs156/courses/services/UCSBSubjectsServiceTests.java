package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import edu.ucsb.cs156.courses.entities.UCSBSubject;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.client.MockRestServiceServer;

@RestClientTest(UCSBSubjectsService.class)
@AutoConfigureDataJpa
@ContextConfiguration(classes = {})
class UCSBSubjectsServiceTests {

  @Autowired private MockRestServiceServer mockRestServiceServer;

  @Autowired private UCSBSubjectsService ucsbSubjectsService;

  @Value("${app.ucsb.api.consumer_key}")
  private String apiKey;

  private static final String SUBJECTCODE = "ANTH";
  private static final String SUBJECTTRANSLATION = "Anthropology";
  private static final String DEPTCODE = "ANTH";
  private static final String COLLEGECODE = "L&S";
  private static final String RELATEDDEPTCODE = "NONE";
  private static final Boolean INACTIVE = false;

  private String expectedResult =
      String.format(
          """
          [
            {
              \"subjectCode\": \"%s\",
              \"subjectTranslation\":\"%s\",
              \"deptCode\": \"%s\",
              \"collegeCode\": \"%s\",
              \"relatedDeptCode\": \"%s\",
              \"inactive\": %s
            },
            {
              \"subjectCode\": \"SUBJECTCODE\",
              \"subjectTranslation\":\"SUBJECTTRANSLATION\",
              \"deptCode\": \"DEPTCODE\",
              \"collegeCode\": \"COLLEGECODE\",
              \"relatedDeptCode\": \"RELATEDDEPTCODE\",
              \"inactive\": false
            }
          ]
          """,
          SUBJECTCODE,
          SUBJECTTRANSLATION,
          DEPTCODE,
          COLLEGECODE,
          RELATEDDEPTCODE,
          INACTIVE.toString());

  @Test
  void get_returns_a_list_of_subjects() throws Exception {

    String expectedURL = UCSBSubjectsService.ENDPOINT;

    UCSBSubject expectedSubject =
        UCSBSubject.builder()
            .subjectCode(SUBJECTCODE)
            .subjectTranslation(SUBJECTTRANSLATION)
            .deptCode(DEPTCODE)
            .collegeCode(COLLEGECODE)
            .relatedDeptCode(RELATEDDEPTCODE)
            .inactive(INACTIVE)
            .build();

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

    List<UCSBSubject> actualResult = ucsbSubjectsService.get();
    List<UCSBSubject> expectedList = new ArrayList<>();
    expectedList.addAll(Arrays.asList(expectedSubject));
    assertIterableEquals(expectedList, actualResult);
  }

  @Test
  void test_loadAllSubjects() throws Exception {

    String expectedURL = UCSBSubjectsService.ENDPOINT;

    UCSBSubject expectedSubject =
        UCSBSubject.builder()
            .subjectCode(SUBJECTCODE)
            .subjectTranslation(SUBJECTTRANSLATION)
            .deptCode(DEPTCODE)
            .collegeCode(COLLEGECODE)
            .relatedDeptCode(RELATEDDEPTCODE)
            .inactive(INACTIVE)
            .build();

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

    List<UCSBSubject> actualResult = ucsbSubjectsService.loadAllSubjects();
    List<UCSBSubject> expectedList = new ArrayList<>();
    expectedList.addAll(Arrays.asList(expectedSubject));
    assertIterableEquals(expectedList, actualResult);
  }
}
