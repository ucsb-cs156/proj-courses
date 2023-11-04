package edu.ucsb.cs156.courses.testconfig;

import edu.ucsb.cs156.courses.services.CurrentUserService;
import edu.ucsb.cs156.courses.services.GrantedAuthoritiesService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestConfig {

  @Bean
  public CurrentUserService currentUserService() {
    return new MockCurrentUserServiceImpl();
  }

  @Bean
  public GrantedAuthoritiesService grantedAuthoritiesService() {
    return new GrantedAuthoritiesService();
  }
}
