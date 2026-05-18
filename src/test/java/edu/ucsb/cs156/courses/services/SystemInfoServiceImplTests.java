package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.models.SystemInfo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

// The unit under test relies on property values
// AB - The unit under test should still rely on property values, but I've moved to @SpringBootTest
// as we need injection for ucsbapiQuarterService.
// For hints on testing, see: https://www.baeldung.com/spring-boot-testing-configurationproperties

@SpringBootTest
@TestPropertySource("classpath:application-development.properties")
class SystemInfoServiceImplTests {

  @Autowired private SystemInfoService systemInfoService;

  @MockitoBean private UCSBAPIQuarterService ucsbapiQuarterService;

  @Test
  void test_getSystemInfo() {

    try {
      when(ucsbapiQuarterService.getCurrentEndQuarterYYYYQ()).thenReturn("20222");
    } catch (Exception e) {
      // There's no exception, since getCurrentEndQuarter is being called from a mock.
    }

    SystemInfo si = systemInfoService.getSystemInfo();
    assertTrue(si.getSpringH2ConsoleEnabled());
    assertTrue(si.getShowSwaggerUILink());
    assertTrue(si.getGithubUrl().startsWith(si.getSourceRepo()));
    assertTrue(si.getGithubUrl().endsWith(si.getCommitId()));
    assertTrue(si.getGithubUrl().contains("/commit/"));
    assertTrue(si.getEndQtrYYYYQ().equals("20222"));
  }

  @Test
  void test_getSystemInfo_getCurrentEndQuarter_Exception() {

    try {
      when(ucsbapiQuarterService.getCurrentEndQuarterYYYYQ())
          .thenThrow(new Exception("A test error, pretending getCurrentEndQuarterYYYYQ failed."));
    } catch (Exception e) {
      // There's no exception, since getCurrentEndQuarter is being called from a mock.
    }

    SystemInfo si = systemInfoService.getSystemInfo();
    assertTrue(si.getSpringH2ConsoleEnabled());
    assertTrue(si.getShowSwaggerUILink());
    assertTrue(si.getGithubUrl().startsWith(si.getSourceRepo()));
    assertTrue(si.getGithubUrl().endsWith(si.getCommitId()));
    assertTrue(si.getGithubUrl().contains("/commit/"));
    assertTrue(si.getEndQtrYYYYQ().equals(si.getStartQtrYYYYQ()));
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
