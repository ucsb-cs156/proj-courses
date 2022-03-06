package edu.ucsb.cs156.example.services;

import java.util.List;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import edu.ucsb.cs156.example.entities.UCSBSubject;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;

@Slf4j
@Service("UCSBSubjects")
public class UCSBSubjectsService {

    @Autowired
    private ObjectMapper mapper;

    @Value("${app.ucsb.api.consumer_key}")
    private String apiKey;

    public static final String ENDPOINT = "https://api.ucsb.edu/students/lookups/v1/subjects?includeInactive=false";

    private final RestTemplate restTemplate;

    public UCSBSubjectsService(RestTemplateBuilder restTemplateBuilder) {
        restTemplate = restTemplateBuilder.build();
    }
    public List<UCSBSubject> get() throws JsonProcessingException {

        // TODO: Replace with a service that will call the UCSB
        // developer API at the endpoint
        // https://api.ucsb.edu/students/lookups/v1/subjects?includeInactive=false
        // convert the JSON to a List<UCSBSubjects> object
        // return that object.

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("ucsb-api-key", this.apiKey);
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> re = restTemplate.exchange(ENDPOINT, HttpMethod.GET, entity, String.class);
        
        String retBody = re.getBody();
        List<UCSBSubject> subjects = mapper.readValue(retBody, new TypeReference<List<UCSBSubject>>() {});
        
        return subjects;
    }

}
