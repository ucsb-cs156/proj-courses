package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.UCSBAPIQuarter;
import edu.ucsb.cs156.courses.repositories.UCSBAPIQuarterRepository;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

@RestClientTest(UCSBAPIQuarterService.class)
@AutoConfigureDataJpa
@TestPropertySource(
    properties = {
      "app.startQtrYYYYQ=20211",
      "app.endQtrYYYYQ=20223",
      "app.ucsb.api.consumer_key=fakeApiKey"
    })
public class UCSBAPIQuarterServiceTests {

  @Value("${app.ucsb.api.consumer_key}")
  private String apiKey;

  @Autowired private MockRestServiceServer mockRestServiceServer;

  @Mock private RestTemplate restTemplate;

  @MockBean private UCSBAPIQuarterRepository ucsbApiQuarterRepository;

  @Autowired private UCSBAPIQuarterService service;

  @Autowired private ObjectMapper objectMapper;

  @Test
  public void test_getStartQtrYYYYQ() {
    assertEquals("20211", service.getStartQtrYYYYQ());
  } // the value of app.startQtrYYYYQ is configured using @TestPropertySource

  @Test
  public void test_getEndQtrYYYYQ() {
    assertEquals("20223", service.getEndQtrYYYYQ());
  } // the value of app.endQtrYYYYQ is configured using @TestPropertySource

  @Test
  public void test_getCurrentQuarterYYYYQ() throws Exception {
    String expectedURL = UCSBAPIQuarterService.CURRENT_QUARTER_ENDPOINT;

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-version", "1.0"))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(
            withSuccess(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, MediaType.APPLICATION_JSON));

    assertEquals("20243", service.getCurrentQuarterYYYYQ());
  }

  @Test
  public void test_getCurrentQuarter() throws Exception {
    UCSBAPIQuarter expectedResult =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, UCSBAPIQuarter.class);

    String expectedURL = UCSBAPIQuarterService.CURRENT_QUARTER_ENDPOINT;

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-version", "1.0"))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(
            withSuccess(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, MediaType.APPLICATION_JSON));

    UCSBAPIQuarter result = service.getCurrentQuarter();

    assertEquals(expectedResult, result);
  }

  @Test
  public void test_getAllQuartersFromAPI() throws Exception {
    UCSBAPIQuarter sampleQuarter =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, UCSBAPIQuarter.class);

    List<UCSBAPIQuarter> expectedResult = new ArrayList<UCSBAPIQuarter>();
    expectedResult.add(sampleQuarter);
    String expectedJSON = objectMapper.writeValueAsString(expectedResult);

    String expectedURL = UCSBAPIQuarterService.ALL_QUARTERS_ENDPOINT;

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-version", "1.0"))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(withSuccess(expectedJSON, MediaType.APPLICATION_JSON));

    List<UCSBAPIQuarter> actualResult = service.getAllQuartersFromAPI();

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_getActiveQuarters() throws Exception {
    UCSBAPIQuarter sampleCurrent =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_W21, UCSBAPIQuarter.class);
    String expectedJSON = objectMapper.writeValueAsString(sampleCurrent);
    String expectedURL = UCSBAPIQuarterService.CURRENT_QUARTER_ENDPOINT;
    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-version", "1.0"))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(withSuccess(expectedJSON, MediaType.APPLICATION_JSON));

    List<String> expectedResult =
        List.of("20211", "20212", "20213", "20214", "20221", "20222", "20223");
    List<String> actualResult = service.getActiveQuarters();

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_getActiveQuarters_returns_no_past_quarters() throws Exception {
    UCSBAPIQuarter sampleCurrent =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, UCSBAPIQuarter.class);
    String expectedJSON = objectMapper.writeValueAsString(sampleCurrent);
    String expectedURL = UCSBAPIQuarterService.CURRENT_QUARTER_ENDPOINT;
    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-version", "1.0"))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(withSuccess(expectedJSON, MediaType.APPLICATION_JSON));

    List<String> expectedResult = List.of();
    List<String> actualResult = service.getActiveQuarters();

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_getActiveQuarters_returns_one_value_when_current_equals_end() throws Exception {
    UCSBAPIQuarter sampleCurrent =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, UCSBAPIQuarter.class);
    sampleCurrent.setQuarter("20223");
    String expectedJSON = objectMapper.writeValueAsString(sampleCurrent);
    String expectedURL = UCSBAPIQuarterService.CURRENT_QUARTER_ENDPOINT;
    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-version", "1.0"))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(withSuccess(expectedJSON, MediaType.APPLICATION_JSON));

    List<String> expectedResult = List.of("20223");
    List<String> actualResult = service.getActiveQuarters();

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_getAllQuarters_preloaded() throws Exception {
    UCSBAPIQuarter sampleQuarter =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, UCSBAPIQuarter.class);

    List<UCSBAPIQuarter> expectedResult = new ArrayList<UCSBAPIQuarter>();
    expectedResult.add(sampleQuarter);

    when(ucsbApiQuarterRepository.findAll()).thenReturn(expectedResult);

    List<UCSBAPIQuarter> actualResult = service.getAllQuarters();
    verify(ucsbApiQuarterRepository, times(1)).findAll();

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_getAllQuarters_empty() throws Exception {
    UCSBAPIQuarter F20 =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_F20, UCSBAPIQuarter.class);
    UCSBAPIQuarter W21 =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_W21, UCSBAPIQuarter.class);
    UCSBAPIQuarter M23 =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_M24, UCSBAPIQuarter.class);

    List<UCSBAPIQuarter> emptyList = new ArrayList<UCSBAPIQuarter>();
    List<UCSBAPIQuarter> expectedResult = new ArrayList<UCSBAPIQuarter>();
    expectedResult.add(W21);

    when(ucsbApiQuarterRepository.findAll()).thenReturn(emptyList);
    when(ucsbApiQuarterRepository.save(W21)).thenReturn(W21);

    List<UCSBAPIQuarter> expectedAPIResult = new ArrayList<UCSBAPIQuarter>();
    expectedAPIResult.add(F20); // expected to be ignored
    expectedAPIResult.add(W21); // expected to be saved
    expectedAPIResult.add(M23); // expected to be saved

    String expectedURL = UCSBAPIQuarterService.ALL_QUARTERS_ENDPOINT;

    String expectedJSON = objectMapper.writeValueAsString(expectedAPIResult);

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-version", "1.0"))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(withSuccess(expectedJSON, MediaType.APPLICATION_JSON));

    List<UCSBAPIQuarter> actualResult = service.getAllQuarters();
    verify(ucsbApiQuarterRepository, times(1)).findAll();
    verify(ucsbApiQuarterRepository, times(1)).save(eq(W21));

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_quarterYYYYQInRange_20211_true() {
    assertEquals(true, service.quarterYYYYQInRange("20211"));
  }

  @Test
  public void test_quarterYYYYQInRange_20212_true() {
    assertEquals(true, service.quarterYYYYQInRange("20212"));
  }

  @Test
  public void test_quarterYYYYQInRange_20222_true() {
    assertEquals(true, service.quarterYYYYQInRange("20222"));
  }

  @Test
  public void test_quarterYYYYQInRange_20223_true() {
    assertEquals(true, service.quarterYYYYQInRange("20223"));
  }

  @Test
  public void test_quarterYYYYQInRange_20204_false() {
    assertEquals(false, service.quarterYYYYQInRange("20204"));
  }

  @Test
  public void test_quarterYYYYQInRange_20224_false() {
    assertEquals(false, service.quarterYYYYQInRange("20224"));
  }

  @Test
  public void test_quarterYYYYQInRange_20231_false() {
    assertEquals(false, service.quarterYYYYQInRange("20231"));
  }
}
