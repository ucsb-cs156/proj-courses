package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import edu.ucsb.cs156.courses.models.SystemInfo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

// The unit under test relies on property values
// For hints on testing, see: https://www.baeldung.com/spring-boot-testing-configurationproperties

@ExtendWith(SpringExtension.class)
@EnableConfigurationProperties(value = SystemInfoServiceImpl.class)
@TestPropertySource("classpath:application-development.properties")
class SystemInfoServiceImplTests {

  @Autowired private SystemInfoService systemInfoService;

  @Test
  void test_getSystemInfo() {
    SystemInfo si = systemInfoService.getSystemInfo();
    assertTrue(si.getSpringH2ConsoleEnabled());
    assertTrue(si.getShowSwaggerUILink());
    assertEquals(si.getGithubUrl(), "https://github.com/ucsb-cs156/proj-courses/commit/unknown");
  }

  @Test
  void test_githubUrl() {
    assertEquals(
        SystemInfoServiceImpl.githubUrl(
            "https://github.com/ucsb-cs156/proj-courses", "abcdef12345"),
        "https://github.com/ucsb-cs156/proj-courses/commit/abcdef12345");
    assertNull(SystemInfoServiceImpl.githubUrl(null, null));
    assertNull(SystemInfoServiceImpl.githubUrl("x", null));
    assertNull(SystemInfoServiceImpl.githubUrl(null, "x"));
  }
}
