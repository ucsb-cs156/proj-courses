package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.UCSBAPIQuarter;
import edu.ucsb.cs156.courses.repositories.UCSBAPIQuarterRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@EnableConfigurationProperties(value = IsStaleService.class)
@TestPropertySource(
    properties = {
      "app.startQtrYYYYQ=20211",
      "app.endQtrYYYYQ=20223",
      "app.ucsb.api.consumer_key=fakeApiKey",
      "app.courseDataStaleThresholdMinutes=1440",
      "spring.main.banner-mode=off"
    })
class IsStaleServiceTests {

  @Autowired private IsStaleService isStaleService;
  @MockBean private UpdateService updateService;
  @MockBean private UCSBAPIQuarterService ucsbApiQuarterService;
  @MockBean private UCSBAPIQuarterRepository ucsbApiQuarterRepository;

  private ObjectMapper objectMapper = new ObjectMapper();

  @Test
  void test_getCourseDataStaleThresholdMinutes() {
    assertEquals(1440, isStaleService.getCourseDataStaleThresholdMinutes());
  }

  @Test
  void test_getLastUpdate__no_update_exists__true() throws Exception {
    when(updateService.getLastUpdate("CMPSC", "20221")).thenReturn(Optional.empty());
    assertTrue(isStaleService.isStale("CMPSC", "20221"));
  }

  @Test
  void test_getLastUpdate__update_exists__details_for_quarter_do_not_exist__default_to_stale()
      throws Exception {
    // arrange

    int courseDataStaleThresholdMinutes = isStaleService.getCourseDataStaleThresholdMinutes();
    UCSBAPIQuarter W21 =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .lastDayOfSchedule(LocalDateTime.of(2021, 3, 19, 0, 0))
            .build();
    LocalDateTime lastDayOfW21 = W21.getLastDayOfSchedule();
    LocalDateTime lastUpdateTime = lastDayOfW21.minusMinutes(courseDataStaleThresholdMinutes + 1);

    when(updateService.getLastUpdate("CMPSC", "20211")).thenReturn(Optional.of(lastUpdateTime));
    when(ucsbApiQuarterService.getCurrentQuarterYYYYQ()).thenReturn("20212");
    when(ucsbApiQuarterRepository.findByQuarter("20211")).thenReturn(Optional.empty());

    // act / assert

    assertTrue(isStaleService.isStale("CMPSC", "20211"));
  }

  @Test
  void test_getLastUpdate__update_exists__past_quarter__updated_before_end_of_quarter()
      throws Exception {
    // arrange

    int courseDataStaleThresholdMinutes = isStaleService.getCourseDataStaleThresholdMinutes();
    UCSBAPIQuarter W21 =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .lastDayOfSchedule(LocalDateTime.of(2021, 3, 19, 0, 0))
            .build();
    LocalDateTime lastDayOfW21 = W21.getLastDayOfSchedule();
    LocalDateTime lastUpdateTime = lastDayOfW21.minusMinutes(courseDataStaleThresholdMinutes + 1);

    when(updateService.getLastUpdate("CMPSC", "20211")).thenReturn(Optional.of(lastUpdateTime));
    when(ucsbApiQuarterService.getCurrentQuarterYYYYQ()).thenReturn("20212");
    when(ucsbApiQuarterRepository.findByQuarter("20211")).thenReturn(Optional.of(W21));

    // act / assert

    assertTrue(isStaleService.isStale("CMPSC", "20211"));
  }

  @Test
  void test_getLastUpdate__update_exists__past_quarter__updated_after_end_of_quarter()
      throws Exception {
    // arrange

    UCSBAPIQuarter W21 =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .lastDayOfSchedule(LocalDateTime.of(2021, 3, 19, 0, 0))
            .build();
    LocalDateTime lastDayOfW21 = W21.getLastDayOfSchedule();
    LocalDateTime lastUpdateTime = lastDayOfW21.plusMinutes(1);

    when(updateService.getLastUpdate("CMPSC", "20211")).thenReturn(Optional.of(lastUpdateTime));
    when(ucsbApiQuarterService.getCurrentQuarterYYYYQ()).thenReturn("20212");
    when(ucsbApiQuarterRepository.findByQuarter("20211")).thenReturn(Optional.of(W21));

    // act / assert

    assertFalse(isStaleService.isStale("CMPSC", "20211"));
  }

  @Test
  void test_getLastUpdate__update_exists__current_quarter__recent_update() throws Exception {

    int staleThresholdMinutes = isStaleService.getCourseDataStaleThresholdMinutes();

    // arrange

    // The quarter is the current quarter
    // The last update was at least three update intervals before the end of the quarter
    // The current time is one minute before the data becomes stale

    UCSBAPIQuarter W21 =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .lastDayOfSchedule(LocalDateTime.of(2021, 3, 19, 0, 0))
            .build();
    LocalDateTime lastDayOfW21 = W21.getLastDayOfSchedule();
    LocalDateTime lastUpdateTime = lastDayOfW21.minusMinutes(staleThresholdMinutes * 3);
    LocalDateTime staleTime = lastUpdateTime.plusMinutes(staleThresholdMinutes);
    LocalDateTime mockNow = staleTime.minusMinutes(1); // one minute before data becomes stale

    when(updateService.getLastUpdate("CMPSC", "20211")).thenReturn(Optional.of(lastUpdateTime));
    when(ucsbApiQuarterService.getCurrentQuarterYYYYQ()).thenReturn("20211");
    when(ucsbApiQuarterRepository.findByQuarter("20211")).thenReturn(Optional.of(W21));

    // act / assert

    try (MockedStatic<LocalDateTime> mockNowStatic = Mockito.mockStatic(LocalDateTime.class)) {
      mockNowStatic.when(LocalDateTime::now).thenReturn(mockNow);
      assertFalse(isStaleService.isStale("CMPSC", "20211"));
    }
  }

  @Test
  void test_getLastUpdate__update_exists__current_quarter__not_a_recent_update() throws Exception {

    int staleThresholdMinutes = isStaleService.getCourseDataStaleThresholdMinutes();

    // arrange

    // The quarter is the current quarter
    // The last update was at least three update intervals before the end of the quarter
    // The current time is one minute after the data becomes stale

    UCSBAPIQuarter W21 =
        UCSBAPIQuarter.builder()
            .quarter("20211")
            .lastDayOfSchedule(LocalDateTime.of(2021, 3, 19, 0, 0))
            .build();
    LocalDateTime lastDayOfW21 = W21.getLastDayOfSchedule();
    LocalDateTime lastUpdateTime = lastDayOfW21.minusMinutes(staleThresholdMinutes * 3);
    LocalDateTime staleTime = lastUpdateTime.plusMinutes(staleThresholdMinutes);
    LocalDateTime mockNow = staleTime.plusMinutes(1); // one minute after data becomes stale

    when(updateService.getLastUpdate("CMPSC", "20211")).thenReturn(Optional.of(lastUpdateTime));
    when(ucsbApiQuarterService.getCurrentQuarterYYYYQ()).thenReturn("20211");
    when(ucsbApiQuarterRepository.findByQuarter("20211")).thenReturn(Optional.of(W21));

    // act / assert

    try (MockedStatic<LocalDateTime> mockNowStatic = Mockito.mockStatic(LocalDateTime.class)) {
      mockNowStatic.when(LocalDateTime::now).thenReturn(mockNow);
      assertTrue(isStaleService.isStale("CMPSC", "20211"));
    }
  }
}
