package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.entities.UCSBSubject;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.test.web.client.MockRestServiceServer;

import org.mockito.MockitoAnnotations;
import org.mockito.Mock;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

@RestClientTest(UCSBSubjectsService.class)
@AutoConfigureDataJpa
class UCSBSubjectsServiceTests {

  @Autowired
  private MockRestServiceServer mockRestServiceServer;

  @Autowired
  private UCSBSubjectsService ucsbSubjectsService;

  @Value("${app.ucsb.api.consumer_key}")
  private String apiKey;

  private static final String SUBJECTCODE = "SUBJECTCODE";
  private static final String SUBJECTTRANSLATION = "SUBJECTTRANSLATION";
  private static final String DEPTCODE = "DEPTCODE";
  private static final String COLLEGECODE = "COLLEGECODE";
  private static final String RELATEDDEPTCODE = "RELATEDDEPTCODE";
  private static final Boolean INACTIVE = false;

  @Test
  void get_returns_a_list_of_subjects() throws Exception{

    String expectedURL = ucsbSubjectsService.ENDPOINT;
    
    String expectedResult = String.format("""
    [
    {
      \"subjectCode\": \"%s\", 
      \"subjectTranslation\":\"%s\", 
      \"deptCode\": \"%s\",
      \"collegeCode\": \"%s\",
      \"relatedDeptCode\": \"%s\",
      \"inactive\": \"%s\"
    }
    ]
    """,SUBJECTCODE, SUBJECTTRANSLATION, DEPTCODE, COLLEGECODE, RELATEDDEPTCODE, INACTIVE.toString());

    UCSBSubject expectedSubject = UCSBSubject.builder()
      .subjectCode(SUBJECTCODE)
      .subjectTranslation(SUBJECTTRANSLATION)
      .deptCode(DEPTCODE)
      .collegeCode(COLLEGECODE)
      .relatedDeptCode(RELATEDDEPTCODE)
      .inactive(INACTIVE)
      .build();

      this.mockRestServiceServer.expect(requestTo(expectedURL))
                .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
                .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
                .andExpect(header("ucsb-api-key", apiKey))
                .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

      List<UCSBSubject> actualResult = ucsbSubjectsService.get();
      List<UCSBSubject> expectedList = new ArrayList<>();
      expectedList.addAll(Arrays.asList(expectedSubject));
      assertEquals(expectedList, actualResult);
  }

}
