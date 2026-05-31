package edu.ucsb.cs156.courses.testconfig;

import edu.ucsb.cs156.courses.services.CurrentUserService;
import edu.ucsb.cs156.courses.services.GrantedAuthoritiesService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;

@TestConfiguration
@EnableMethodSecurity
@EnableWebSecurity
public class TestConfig {

  @Bean
  public CurrentUserService currentUserService() {
    return new MockCurrentUserServiceImpl();
  }

  @Bean
  public GrantedAuthoritiesService grantedAuthoritiesService() {
    return new GrantedAuthoritiesService();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http.exceptionHandling(
            handling -> handling.authenticationEntryPoint(new Http403ForbiddenEntryPoint()))
        .build();
  }
}
