package edu.ucsb.cs156.courses.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.UCSBAPIQuarter;
import edu.ucsb.cs156.courses.models.Quarter;
import edu.ucsb.cs156.courses.repositories.UCSBAPIQuarterRepository;
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

  @Value("${app.endQtrYYYYQ:20222}")
  private String endQtrYYYYQ;

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

  public static final String ALL_QUARTERS_ENDPOINT =
      "https://api.ucsb.edu/academics/quartercalendar/v1/quarters";

  public static final String END_QUARTER_ENDPOINT =
      "https://api.ucsb.edu/academics/quartercalendar/v1/quarters/end";

  public String getStartQtrYYYYQ() {
    return startQtrYYYYQ;
  }

  public String getEndQtrYYYYQ() {
    return endQtrYYYYQ;
  }

  public String getCurrentQuarterYYYYQ() throws Exception {
    UCSBAPIQuarter quarter = getCurrentQuarter();
    return quarter.getQuarter();
  }

  public UCSBAPIQuarter getCurrentQuarter() throws Exception {
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

    log.info(
        "json: {} contentType: {} statusCode: {} entity: {}",
        retVal,
        contentType,
        statusCode,
        entity);
    UCSBAPIQuarter quarter = null;
    quarter = objectMapper.readValue(retVal, UCSBAPIQuarter.class);
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

  public boolean quarterYYYYQInRange(String quarterYYYYQ) {
    boolean dateGEStart = quarterYYYYQ.compareTo(startQtrYYYYQ) >= 0;
    boolean dateLEEnd = quarterYYYYQ.compareTo(endQtrYYYYQ) <= 0;
    return (dateGEStart && dateLEEnd);
  }

  public List<UCSBAPIQuarter> loadAllQuarters() throws Exception {
    List<UCSBAPIQuarter> quarters = this.getAllQuartersFromAPI();
    List<UCSBAPIQuarter> savedQuarters = new ArrayList<UCSBAPIQuarter>();
    quarters.forEach(
        (quarter) -> {
          if (quarterYYYYQInRange(quarter.getQuarter())) {
            ucsbApiQuarterRepository.save(quarter);
            savedQuarters.add(quarter);
          }
        });
    log.info("savedQuarters.size={}", savedQuarters.size());
    return savedQuarters;
  }

  public List<String> getActiveQuarterList() throws Exception {
    List<String> activeQuarters = new ArrayList<>();
    String startQuarter = getCurrentQuarterYYYYQ();
    String endQuarter = getEndQtrYYYYQ();

    List<Quarter> quarterObjects = Quarter.quarterList(startQuarter, endQuarter);

    for (Quarter quarter : quarterObjects) {
      activeQuarters.add(quarter.getYYYYQ());
    }

    return activeQuarters;
  }
}
