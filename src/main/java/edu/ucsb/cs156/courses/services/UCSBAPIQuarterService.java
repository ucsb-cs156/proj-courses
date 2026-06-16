package edu.ucsb.cs156.courses.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.UCSBAPIQuarter;
import edu.ucsb.cs156.courses.models.Quarter;
import edu.ucsb.cs156.courses.repositories.UCSBAPIQuarterRepository;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
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
import org.springframework.web.client.RestTemplate;

/** Service object that wraps the UCSB Academic Curriculum API */
@Service
@Slf4j
public class UCSBAPIQuarterService {

  @Value("${app.startQtrYYYYQ:20221}")
  private String startQtrYYYYQ;

  @Autowired private ObjectMapper objectMapper;

  @Autowired UCSBAPIQuarterRepository ucsbApiQuarterRepository;

  @Value("${app.ucsb.api.consumer_key}")
  private String apiKey;

  private RestTemplate restTemplate = new RestTemplate();

  public UCSBAPIQuarterService(RestTemplateBuilder restTemplateBuilder) throws Exception {
    restTemplate = restTemplateBuilder.build();
  }

  public static final String CURRENT_QUARTER_ENDPOINT =
      "https://api.ucsb.edu/academics/quartercalendar/v1/quarters/current";

  public static final int CACHE_DURATION_HOURS = 24;

  private UCSBAPIQuarter cachedCurrentQuarter = null;
  private Instant cacheTime = null;

  void clearCurrentQuarterCache() {
    cachedCurrentQuarter = null;
    cacheTime = null;
  }

  void expireCurrentQuarterCache() {
    cacheTime = Instant.EPOCH;
  }

  public static final String ALL_QUARTERS_ENDPOINT =
      "https://api.ucsb.edu/academics/quartercalendar/v1/quarters";

  public static final String END_QUARTER_ENDPOINT =
      "https://api.ucsb.edu/academics/quartercalendar/v1/quarters/end";

  public String getStartQtrYYYYQ() {
    return startQtrYYYYQ;
  }

  public String getEndQtrYYYYQ() throws Exception {
    // Compute this each call so long-running servers pick up quarter rollovers without restart.
    return getEndQtrYYYYQ(getCurrentQuarterYYYYQ());
  }

  public String getEndQtrYYYYQ(String currentQuarterYYYYQ) {
    validateCurrentQuarterYYYYQ(currentQuarterYYYYQ);
    Quarter endQuarter = new Quarter(currentQuarterYYYYQ);
    int quartersToAdd = "S".equals(endQuarter.getQ()) ? 2 : 1;

    for (int i = 0; i < quartersToAdd; i++) {
      endQuarter.increment();
    }

    return endQuarter.getYYYYQ();
  }

  public String getCurrentQuarterYYYYQ() throws Exception {
    UCSBAPIQuarter quarter = getCurrentQuarter();
    if (quarter == null) {
      throw unableToComputeEndQtrException(null);
    }
    return quarter.getQuarter();
  }

  private void validateCurrentQuarterYYYYQ(String currentQuarterYYYYQ) {
    if (currentQuarterYYYYQ == null
        || currentQuarterYYYYQ.isBlank()
        || !currentQuarterYYYYQ.matches("\\d{5}")) {
      throw unableToComputeEndQtrException(currentQuarterYYYYQ);
    }

    try {
      Quarter.yyyyqToInt(currentQuarterYYYYQ);
    } catch (IllegalArgumentException e) {
      throw unableToComputeEndQtrException(currentQuarterYYYYQ);
    }
  }

  private IllegalStateException unableToComputeEndQtrException(String currentQuarterYYYYQ) {
    String valueForMessage =
        currentQuarterYYYYQ == null ? "null" : String.format("'%s'", currentQuarterYYYYQ);
    return new IllegalStateException(
        String.format(
            "Unable to compute END_QTR: current quarter from UCSB API was null/invalid: %s",
            valueForMessage));
  }

  public List<String> getActiveQuarterList() throws Exception {
    String start = getCurrentQuarterYYYYQ();
    String end = getEndQtrYYYYQ(start);

    List<Quarter> quartersInOrder = Quarter.quarterList(start, end);
    List<String> result = new ArrayList<String>();

    for (Quarter quarter : quartersInOrder) {
      result.add(quarter.getYYYYQ());
    }

    return result;
  }

  public UCSBAPIQuarter getCurrentQuarter() throws Exception {
    if (cachedCurrentQuarter != null
        && Instant.now().isBefore(cacheTime.plus(CACHE_DURATION_HOURS, ChronoUnit.HOURS))) {
      return cachedCurrentQuarter;
    }

    HttpHeaders headers = new HttpHeaders();
    headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("ucsb-api-version", "1.0");
    headers.set("ucsb-api-key", this.apiKey);

    HttpEntity<String> entity = new HttpEntity<>("body", headers);

    String url = CURRENT_QUARTER_ENDPOINT;

    log.info("url=" + url);

    String retVal = "";
    MediaType contentType = null;
    HttpStatus statusCode = null;

    ResponseEntity<String> re = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    contentType = re.getHeaders().getContentType();
    statusCode = (HttpStatus) re.getStatusCode();
    retVal = re.getBody();

    log.info("contentType: {} statusCode: {} entity: {}", contentType, statusCode, entity);
    log.trace("json: {}", retVal);
    UCSBAPIQuarter quarter = null;
    quarter = objectMapper.readValue(retVal, UCSBAPIQuarter.class);
    cachedCurrentQuarter = quarter;
    cacheTime = Instant.now();
    return quarter;
  }

  public List<UCSBAPIQuarter> getAllQuarters() throws Exception {
    List<UCSBAPIQuarter> quarters = ucsbApiQuarterRepository.findAll();
    if (quarters.isEmpty()) {
      quarters = this.loadAllQuarters();
    }
    return quarters;
  }

  public List<UCSBAPIQuarter> getAllQuartersFromAPI() throws Exception {
    HttpHeaders headers = new HttpHeaders();
    headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("ucsb-api-version", "1.0");
    headers.set("ucsb-api-key", this.apiKey);

    HttpEntity<String> entity = new HttpEntity<>("body", headers);

    String url = ALL_QUARTERS_ENDPOINT;

    log.info("url=" + url);

    String retVal = "";
    MediaType contentType = null;
    HttpStatus statusCode = null;

    ResponseEntity<String> re = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    contentType = re.getHeaders().getContentType();
    statusCode = (HttpStatus) re.getStatusCode();
    retVal = re.getBody();

    log.info(
        "json: {} contentType: {} statusCode: {} entity: {}",
        retVal,
        contentType,
        statusCode,
        entity);
    List<UCSBAPIQuarter> quarters = null;
    quarters = objectMapper.readValue(retVal, new TypeReference<List<UCSBAPIQuarter>>() {});
    return quarters;
  }

  public boolean quarterYYYYQInRange(String quarterYYYYQ) throws Exception {
    return quarterYYYYQInRange(quarterYYYYQ, getEndQtrYYYYQ());
  }

  boolean quarterYYYYQInRange(String quarterYYYYQ, String endQtrYYYYQ) {
    boolean dateGEStart = quarterYYYYQ.compareTo(startQtrYYYYQ) >= 0;
    boolean dateLEEnd = quarterYYYYQ.compareTo(endQtrYYYYQ) <= 0;
    return (dateGEStart && dateLEEnd);
  }

  public List<UCSBAPIQuarter> loadAllQuarters() throws Exception {
    String endQtrYYYYQ = getEndQtrYYYYQ();
    List<UCSBAPIQuarter> quarters = this.getAllQuartersFromAPI();
    List<UCSBAPIQuarter> savedQuarters = new ArrayList<UCSBAPIQuarter>();
    quarters.forEach(
        (quarter) -> {
          if (quarterYYYYQInRange(quarter.getQuarter(), endQtrYYYYQ)) {
            ucsbApiQuarterRepository.save(quarter);
            savedQuarters.add(quarter);
          }
        });
    log.info("savedQuarters.size={}", savedQuarters.size());
    return savedQuarters;
  }

  public List<String> getActiveQuarters() throws Exception {
    List<String> activeQuarters = new ArrayList<>();
    String currQtr = getCurrentQuarterYYYYQ();
    String endQtr = getEndQtrYYYYQ(currQtr);

    if (currQtr.compareTo(endQtr) <= 0) {
      Quarter.quarterList(currQtr, endQtr)
          .forEach(quarter -> activeQuarters.add(quarter.getYYYYQ()));
    }

    return activeQuarters;
  }

  public LocalDateTime lastDayToRegister(UCSBAPIQuarter ucsbApiQuarter) {
    if (ucsbApiQuarter == null) {
      return null;
    }

    LocalDateTime lastDayToAddUndergrad = ucsbApiQuarter.getLastDayToAddUnderGrad();
    LocalDateTime lastDayToAddGrad = ucsbApiQuarter.getLastDayToAddGrad();

    if (lastDayToAddUndergrad == null || lastDayToAddGrad == null) {
      return null;
    }

    return lastDayToAddUndergrad.isAfter(lastDayToAddGrad)
        ? lastDayToAddUndergrad
        : lastDayToAddGrad;
  }

  public boolean isQuarterInRegistrationPass(String quarterYYYYQ) {
    UCSBAPIQuarter quarter = ucsbApiQuarterRepository.findById(quarterYYYYQ).orElse(null);
    LocalDateTime lastDay = lastDayToRegister(quarter);

    if (quarter == null) {
      return false;
    }

    if (lastDay == null) {
      return false;
    }

    LocalDateTime pass1Begin = quarter.getPass1Begin();

    if (pass1Begin == null) {
      return false;
    }

    LocalDateTime currentDate = LocalDateTime.now();
    return currentDate.isAfter(pass1Begin) && currentDate.isBefore(lastDay);
  }

  public List<String> getActiveRegistrationQuarters() throws Exception {

    List<String> activeQuarters = getActiveQuarters();

    List<String> registrationQuarters =
        activeQuarters.stream().filter(yyyyq -> isQuarterInRegistrationPass(yyyyq)).toList();
    return registrationQuarters;
  }
}
