package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@EnableConfigurationProperties(value = IsStaleService.class)
@TestPropertySource("classpath:application-development.properties")
class IsStaleServiceTests {

  @Autowired private IsStaleService isStaleService;

  @Test
  void isStale_test() {
    assertTrue(isStaleService.isStale("CMPSC", "20211"));
  }
}
