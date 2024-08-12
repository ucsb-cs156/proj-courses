package edu.ucsb.cs156.courses.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;

@Slf4j
@Service("IsStaleService")
@ConfigurationProperties
public class IsStaleService {

  public boolean isStale(String subjectArea, String quarterYYYYQ) {
    return true;
  }
}
