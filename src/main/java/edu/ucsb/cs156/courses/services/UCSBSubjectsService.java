package edu.ucsb.cs156.courses.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.UCSBSubject;
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

  @Value("${app.ucsb.api.consumer_key}")
  private String apiKey;

  public static final String ENDPOINT =
      "https://api.ucsb.edu/students/lookups/v1/subjects?includeInactive=false";

  private final RestTemplate restTemplate;

  public UCSBSubjectsService(RestTemplateBuilder restTemplateBuilder) {
    restTemplate = restTemplateBuilder.build();
  }

  public List<UCSBSubject> get() throws JsonProcessingException {

    HttpHeaders headers = new HttpHeaders();
    headers.setAccept(List.of(MediaType.APPLICATION_JSON));
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("ucsb-api-key", this.apiKey);

    HttpEntity<String> entity = new HttpEntity<>(headers);
    ResponseEntity<String> re =
        restTemplate.exchange(ENDPOINT, HttpMethod.GET, entity, String.class);

    String retBody = re.getBody();
    List<UCSBSubject> subjects =
        mapper.readValue(retBody, new TypeReference<List<UCSBSubject>>() {});

    return subjects;
  }
}
