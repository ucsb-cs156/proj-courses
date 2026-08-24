package edu.ucsb.cs156.courses.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.UCSBSubject;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service("UCSBSubjects")
public class UCSBSubjectsService {

  @Autowired private ObjectMapper mapper;
  @Autowired private UCSBSubjectRepository subjectRepository;

  @Value("${app.ucsb.api.consumer_key}")
  private String apiKey;

  @Value("${app.ucsb.api.host}")
  private String apiHost;

  public static final String ENDPOINT =
      "{apiHost}/students/lookups/v1/subjects?includeInactive=false";

  private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(10);
  private static final Duration READ_TIMEOUT = Duration.ofSeconds(60);

  private final RestTemplate restTemplate;

  public UCSBSubjectsService(RestTemplateBuilder restTemplateBuilder) {
    restTemplate =
        restTemplateBuilder.connectTimeout(CONNECT_TIMEOUT).readTimeout(READ_TIMEOUT).build();
  }

  public List<UCSBSubject> get() throws JsonProcessingException {

    HttpHeaders headers = new HttpHeaders();
    headers.setAccept(List.of(MediaType.APPLICATION_JSON));
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("ucsb-api-key", this.apiKey);

    String url = ENDPOINT.replace("{apiHost}", apiHost);

    HttpEntity<String> entity = new HttpEntity<>(headers);
    ResponseEntity<String> re = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

    String retBody = re.getBody();
    List<UCSBSubject> subjects =
        mapper.readValue(retBody, new TypeReference<List<UCSBSubject>>() {});

    return subjects;
  }

  public List<UCSBSubject> loadAllSubjects() throws JsonProcessingException {
    List<UCSBSubject> subjects = this.get();
    List<UCSBSubject> savedSubjects = new ArrayList<UCSBSubject>();

    subjects.forEach(
        (ucsbSubject) -> {
          subjectRepository.save(ucsbSubject);
          savedSubjects.add(ucsbSubject);
        });
    log.info("subjects={}", subjects);
    return savedSubjects;
  }
}
