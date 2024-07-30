package edu.ucsb.cs156.courses.testconfig;

import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.services.CurrentUserService;
import edu.ucsb.cs156.courses.services.GrantedAuthoritiesService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

@TestConfiguration
@Import(SecurityConfig.class)
public class TestConfig {

  @Bean
  public CurrentUserService currentUserService() {
    return new MockCurrentUserServiceImpl();
  }

  @Bean
  public GrantedAuthoritiesService grantedAuthoritiesService() {
    return new GrantedAuthoritiesService();
  }

  /**
   * This is needed because of the annotation EnableMongoAuditing on the main class.
   * @returns a MongoMappingContext Bean
   */
  
  @Bean
  public MongoMappingContext mongoMappingContext() {
    return new MongoMappingContext();
  }

}
