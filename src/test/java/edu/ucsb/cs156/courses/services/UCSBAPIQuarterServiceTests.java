package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.UCSBAPIQuarter;
import edu.ucsb.cs156.courses.repositories.UCSBAPIQuarterRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

@RestClientTest(UCSBAPIQuarterService.class)
@TestPropertySource(
    properties = {"app.startQtrYYYYQ=20211", "app.ucsb.api.consumer_key=fakeApiKey"})
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
  public void test_getEndQtrYYYYQ_fromCurrentQuarterEndpoint() throws Exception {
    expectCurrentQuarter("20243");

    assertEquals("20244", service.getEndQtrYYYYQ());
  }

  @Test
  public void test_getEndQtrYYYYQ_fromCurrentQuarterWinter_returnsSpring() throws Exception {
    UCSBAPIQuarterService serviceSpy = Mockito.spy(service);
    doReturn("20241").when(serviceSpy).getCurrentQuarterYYYYQ();

    assertEquals("20242", serviceSpy.getEndQtrYYYYQ());
  }

  @Test
  public void test_getEndQtrYYYYQ_fromCurrentQuarterSpring_returnsFall() throws Exception {
    UCSBAPIQuarterService serviceSpy = Mockito.spy(service);
    doReturn("20242").when(serviceSpy).getCurrentQuarterYYYYQ();

    assertEquals("20244", serviceSpy.getEndQtrYYYYQ());
  }

  @Test
  public void test_getEndQtrYYYYQ_fromCurrentQuarterSummer_returnsFall() throws Exception {
    UCSBAPIQuarterService serviceSpy = Mockito.spy(service);
    doReturn("20243").when(serviceSpy).getCurrentQuarterYYYYQ();

    assertEquals("20244", serviceSpy.getEndQtrYYYYQ());
  }

  @Test
  public void test_getEndQtrYYYYQ_fromCurrentQuarterFall_rollsOverToWinterNextYear()
      throws Exception {
    UCSBAPIQuarterService serviceSpy = Mockito.spy(service);
    doReturn("20244").when(serviceSpy).getCurrentQuarterYYYYQ();

    assertEquals("20251", serviceSpy.getEndQtrYYYYQ());
  }

  @Test
  public void test_getEndQtrYYYYQ_whenCurrentQuarterEndpointReturnsNull_throwsException()
      throws Exception {
    expectCurrentQuarterJson("null");

    IllegalStateException exception =
        assertThrows(IllegalStateException.class, () -> service.getEndQtrYYYYQ());

    assertInvalidCurrentQuarterException(exception, "null");
  }

  @Test
  public void test_getEndQtrYYYYQ_whenCurrentQuarterInputIsNull_throwsException() {
    IllegalStateException exception =
        assertThrows(IllegalStateException.class, () -> service.getEndQtrYYYYQ((String) null));

    assertInvalidCurrentQuarterException(exception, "null");
  }

  @Test
  public void test_getEndQtrYYYYQ_whenCurrentQuarterEndpointReturnsEmptyString_throwsException()
      throws Exception {
    expectCurrentQuarter("");

    IllegalStateException exception =
        assertThrows(IllegalStateException.class, () -> service.getEndQtrYYYYQ());

    assertInvalidCurrentQuarterException(exception, "''");
  }

  @Test
  public void test_getEndQtrYYYYQ_whenCurrentQuarterEndpointReturnsMalformedValue_throwsException()
      throws Exception {
    expectCurrentQuarter("20225");

    IllegalStateException exception =
        assertThrows(IllegalStateException.class, () -> service.getEndQtrYYYYQ());

    assertInvalidCurrentQuarterException(exception, "'20225'");
  }

  @Test
  public void test_getEndQtrYYYYQ_whenCurrentQuarterHasInvalidFormat_throwsException() {
    IllegalStateException exception =
        assertThrows(IllegalStateException.class, () -> service.getEndQtrYYYYQ("abcde"));

    assertInvalidCurrentQuarterException(exception, "'abcde'");
  }

  @Test
  public void test_getEndQtrYYYYQ_whenCurrentQuarterIsWinter() {
    assertEquals("20242", service.getEndQtrYYYYQ("20241"));
  }

  @Test
  public void test_getEndQtrYYYYQ_whenCurrentQuarterIsSpring() {
    assertEquals("20244", service.getEndQtrYYYYQ("20242"));
  }

  @Test
  public void test_getEndQtrYYYYQ_whenCurrentQuarterIsSummer() {
    assertEquals("20244", service.getEndQtrYYYYQ("20243"));
  }

  @Test
  public void test_getEndQtrYYYYQ_whenCurrentQuarterIsFall_rollsOverToWinterNextYear() {
    assertEquals("20251", service.getEndQtrYYYYQ("20244"));
  }

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

    List<String> expectedResult = List.of("20211", "20212");
    List<String> actualResult = service.getActiveQuarters();

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_getActiveQuarters_summer_returns_summer_and_fall() throws Exception {
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

    List<String> expectedResult = List.of("20243", "20244");
    List<String> actualResult = service.getActiveQuarters();

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_getActiveQuarters_summer_2022_returns_summer_and_fall() throws Exception {
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

    List<String> expectedResult = List.of("20223", "20224");
    List<String> actualResult = service.getActiveQuarters();

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_getActiveQuarters_whenCurrentQuarterEqualsEndQuarter_returnsCurrentQuarter()
      throws Exception {
    UCSBAPIQuarterService serviceSpy = Mockito.spy(service);
    doReturn("20211").when(serviceSpy).getCurrentQuarterYYYYQ();
    doReturn("20211").when(serviceSpy).getEndQtrYYYYQ("20211");

    List<String> expectedResult = List.of("20211");
    List<String> actualResult = serviceSpy.getActiveQuarters();

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_getActiveQuarters_whenCurrentQuarterIsAfterEndQuarter_returnsEmptyList()
      throws Exception {
    UCSBAPIQuarterService serviceSpy = Mockito.spy(service);
    doReturn("20212").when(serviceSpy).getCurrentQuarterYYYYQ();
    doReturn("20211").when(serviceSpy).getEndQtrYYYYQ("20212");

    List<String> expectedResult = List.of();
    List<String> actualResult = serviceSpy.getActiveQuarters();

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
    expectedAPIResult.add(M23); // expected to be ignored

    expectCurrentQuarter("20211");
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
  public void test_getActiveQuarterList() throws Exception {
    UCSBAPIQuarter sampleQuarter =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_W21, UCSBAPIQuarter.class);
    String expectedJSON = objectMapper.writeValueAsString(sampleQuarter);
    String expectedURL = UCSBAPIQuarterService.CURRENT_QUARTER_ENDPOINT;
    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-version", "1.0"))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(withSuccess(expectedJSON, MediaType.APPLICATION_JSON));

    List<String> expectedResult = List.of("20211", "20212");
    List<String> actualResult = service.getActiveQuarterList();

    assertEquals(expectedResult, actualResult);
  }

  @Test
  public void test_quarterYYYYQInRange_20211_true() {
    assertEquals(true, service.quarterYYYYQInRange("20211", "20223"));
  }

  @Test
  public void test_quarterYYYYQInRange_20212_true() {
    assertEquals(true, service.quarterYYYYQInRange("20212", "20223"));
  }

  @Test
  public void test_quarterYYYYQInRange_20222_true() {
    assertEquals(true, service.quarterYYYYQInRange("20222", "20223"));
  }

  @Test
  public void test_quarterYYYYQInRange_20223_true() {
    assertEquals(true, service.quarterYYYYQInRange("20223", "20223"));
  }

  @Test
  public void test_quarterYYYYQInRange_20204_false() {
    assertEquals(false, service.quarterYYYYQInRange("20204", "20223"));
  }

  @Test
  public void test_quarterYYYYQInRange_20224_false() {
    assertEquals(false, service.quarterYYYYQInRange("20224", "20223"));
  }

  @Test
  public void test_quarterYYYYQInRange_20231_false() {
    assertEquals(false, service.quarterYYYYQInRange("20231", "20223"));
  }

  @Test
  public void test_quarterYYYYQInRange_withCurrentEndQuarter_20212_true() throws Exception {
    expectCurrentQuarter("20211");

    assertEquals(true, service.quarterYYYYQInRange("20212"));
  }

  @Test
  public void test_quarterYYYYQInRange_withCurrentEndQuarter_20213_false() throws Exception {
    expectCurrentQuarter("20211");

    assertEquals(false, service.quarterYYYYQInRange("20213"));
  }

  @Test
  public void test_lastDayToRegister_null() {
    assertEquals(null, service.lastDayToRegister(null));
  }

  @Test
  public void test_lastDayToRegister_pass1Begin_null() {

    UCSBAPIQuarter quarter =
        new UCSBAPIQuarter(); // null pass1Begin, lastDayToAddUnderGrad, lastDayToAddGrad
    assertEquals(null, service.lastDayToRegister(quarter));
  }

  @Test
  public void test_lastDayToRegister_lastDayToAddUnderGrad_null() {

    UCSBAPIQuarter quarter =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .pass1Begin(LocalDateTime.parse("2020-11-01T00:00:00"))
            .build();

    assertEquals(null, service.lastDayToRegister(quarter));
  }

  @Test
  public void test_lastDayToRegister_lastDayToAddGrad_null() {

    UCSBAPIQuarter quarter =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .pass1Begin(LocalDateTime.parse("2020-11-01T00:00:00"))
            .lastDayToAddUnderGrad(LocalDateTime.parse("2021-01-15T00:00:00"))
            .build();

    assertEquals(null, service.lastDayToRegister(quarter));
  }

  @Test
  public void test_lastDayToRegister_Undergrad_Later() {

    UCSBAPIQuarter quarter =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .pass1Begin(LocalDateTime.parse("2020-11-01T00:00:00"))
            .lastDayToAddUnderGrad(LocalDateTime.parse("2021-02-15T00:00:00"))
            .lastDayToAddGrad(LocalDateTime.parse("2021-01-15T00:00:00"))
            .build();

    assertEquals(LocalDateTime.parse("2021-02-15T00:00:00"), service.lastDayToRegister(quarter));
  }

  @Test
  public void test_lastDayToRegister_Grad_Later() {

    UCSBAPIQuarter quarter =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .pass1Begin(LocalDateTime.parse("2020-11-01T00:00:00"))
            .lastDayToAddUnderGrad(LocalDateTime.parse("2021-02-15T00:00:00"))
            .lastDayToAddGrad(LocalDateTime.parse("2021-02-20T00:00:00"))
            .build();

    assertEquals(LocalDateTime.parse("2021-02-20T00:00:00"), service.lastDayToRegister(quarter));
  }

  @Test
  public void test_isQuarterRegistrationPass_findById_returns_null_then_false() {
    when(ucsbApiQuarterRepository.findById(eq("20211"))).thenReturn(Optional.empty());
    assertEquals(false, service.isQuarterInRegistrationPass("20211"));
  }

  @Test
  public void
      test_isQuarterRegistrationPass_findById_returns_quarter_with_null_values_then_false() {
    UCSBAPIQuarter quarterWithNullValues =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .pass1Begin(null)
            .lastDayToAddUnderGrad(null)
            .lastDayToAddGrad(null)
            .build();
    when(ucsbApiQuarterRepository.findById(eq("20211")))
        .thenReturn(Optional.of(quarterWithNullValues));
    assertEquals(false, service.isQuarterInRegistrationPass("20211"));
  }

  @Test
  public void
      test_isQuarterRegistrationPass_findById_returns_quarter_with_pass1_null_returns_false() {
    UCSBAPIQuarter quarterWithNullValues =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .pass1Begin(null)
            .lastDayToAddUnderGrad(LocalDateTime.parse("2021-01-15T00:00:00"))
            .lastDayToAddGrad(LocalDateTime.parse("2021-02-15T00:00:00"))
            .build();
    when(ucsbApiQuarterRepository.findById(eq("20211")))
        .thenReturn(Optional.of(quarterWithNullValues));
    assertEquals(false, service.isQuarterInRegistrationPass("20211"));
  }

  @Test
  public void
      test_isQuarterRegistrationPass_20211_findById_returns_object_with_good_values_but_date_before_pass1() {
    // Arrange
    UCSBAPIQuarter quarter =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .pass1Begin(LocalDateTime.parse("2020-11-01T00:00:00"))
            .lastDayToAddUnderGrad(LocalDateTime.parse("2021-01-15T00:00:00"))
            .lastDayToAddGrad(LocalDateTime.parse("2021-01-15T00:00:00"))
            .build();

    when(ucsbApiQuarterRepository.findById(eq("20211"))).thenReturn(Optional.of(quarter));

    LocalDateTime fixedDateTime = LocalDateTime.parse("2020-10-01T00:00:00");

    try (MockedStatic<LocalDateTime> mockedLocalDateTime =
        Mockito.mockStatic(LocalDateTime.class)) {
      mockedLocalDateTime.when(LocalDateTime::now).thenReturn(fixedDateTime);
      assertEquals(false, service.isQuarterInRegistrationPass("20211"));
    }
  }

  @Test
  public void
      test_isQuarterRegistrationPass_20211_findById_returns_object_with_good_values_but_date_after_last_day() {
    // Arrange
    UCSBAPIQuarter quarter =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .pass1Begin(LocalDateTime.parse("2020-11-01T00:00:00"))
            .lastDayToAddUnderGrad(LocalDateTime.parse("2021-01-15T00:00:00"))
            .lastDayToAddGrad(LocalDateTime.parse("2021-01-15T00:00:00"))
            .build();

    when(ucsbApiQuarterRepository.findById(eq("20211"))).thenReturn(Optional.of(quarter));

    LocalDateTime fixedDateTime = LocalDateTime.parse("2021-04-01T00:00:00");

    try (MockedStatic<LocalDateTime> mockedLocalDateTime =
        Mockito.mockStatic(LocalDateTime.class)) {
      mockedLocalDateTime.when(LocalDateTime::now).thenReturn(fixedDateTime);
      assertEquals(false, service.isQuarterInRegistrationPass("20211"));
    }
  }

  @Test
  public void
      test_isQuarterRegistrationPass_20211_findById_returns_object_with_good_values_and_date_is_in_range() {
    // Arrange
    UCSBAPIQuarter quarter =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .pass1Begin(LocalDateTime.parse("2020-11-01T00:00:00"))
            .lastDayToAddUnderGrad(LocalDateTime.parse("2021-01-15T00:00:00"))
            .lastDayToAddGrad(LocalDateTime.parse("2021-01-15T00:00:00"))
            .build();

    when(ucsbApiQuarterRepository.findById(eq("20211"))).thenReturn(Optional.of(quarter));

    LocalDateTime fixedDateTime = LocalDateTime.parse("2020-11-02T00:00:00");

    try (MockedStatic<LocalDateTime> mockedLocalDateTime =
        Mockito.mockStatic(LocalDateTime.class)) {
      mockedLocalDateTime.when(LocalDateTime::now).thenReturn(fixedDateTime);
      assertEquals(true, service.isQuarterInRegistrationPass("20211"));
    }
  }

  @Test
  public void test_getActiveRegistrationQuarters() throws Exception {
    UCSBAPIQuarter W21 =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_W21, UCSBAPIQuarter.class);
    UCSBAPIQuarter S21 =
        objectMapper.readValue(UCSBAPIQuarter.SAMPLE_QUARTER_JSON_S21, UCSBAPIQuarter.class);

    String expectedJSON = objectMapper.writeValueAsString(W21);
    String expectedURL = UCSBAPIQuarterService.CURRENT_QUARTER_ENDPOINT;
    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-version", "1.0"))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(withSuccess(expectedJSON, MediaType.APPLICATION_JSON));

    when(ucsbApiQuarterRepository.findById(eq("20211"))).thenReturn(Optional.of(W21));
    when(ucsbApiQuarterRepository.findById(eq("20212"))).thenReturn(Optional.of(S21));

    LocalDateTime fixedDateTime = LocalDateTime.parse("2021-02-09T00:00:00");

    try (MockedStatic<LocalDateTime> mockedLocalDateTime =
        Mockito.mockStatic(LocalDateTime.class)) {
      mockedLocalDateTime.when(LocalDateTime::now).thenReturn(fixedDateTime);

      List<String> expectedResult = List.of("20212");
      List<String> actualResult = service.getActiveRegistrationQuarters();

      assertEquals(expectedResult, actualResult);
    }
  }

  private void expectCurrentQuarter(String quarterYYYYQ) throws Exception {
    UCSBAPIQuarter currentQuarter = UCSBAPIQuarter.builder().quarter(quarterYYYYQ).build();
    String expectedJSON = objectMapper.writeValueAsString(currentQuarter);
    expectCurrentQuarterJson(expectedJSON);
  }

  private void expectCurrentQuarterJson(String expectedJSON) {
    String expectedURL = UCSBAPIQuarterService.CURRENT_QUARTER_ENDPOINT;
    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("ucsb-api-version", "1.0"))
        .andExpect(header("ucsb-api-key", apiKey))
        .andRespond(withSuccess(expectedJSON, MediaType.APPLICATION_JSON));
  }

  private void assertInvalidCurrentQuarterException(
      IllegalStateException exception, String expectedValue) {
    assertEquals(
        String.format(
            "Unable to compute END_QTR: current quarter from UCSB API was null/invalid: %s",
            expectedValue),
        exception.getMessage());
  }
}
