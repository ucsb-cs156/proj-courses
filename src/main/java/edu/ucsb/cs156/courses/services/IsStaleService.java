package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.entities.UCSBAPIQuarter;
import edu.ucsb.cs156.courses.repositories.UCSBAPIQuarterRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;

@Slf4j
@Service("IsStaleService")
@ConfigurationProperties
public class IsStaleService {

  @Value("#{new Integer('${app.courseDataStaleThresholdMinutes:1440}')}")
  private Integer courseDataStaleThresholdMinutes;

  @Autowired private UCSBAPIQuarterService ucsbApiQuarterService;
  @Autowired private UCSBAPIQuarterRepository ucsbApiQuarterRepository;
  @Autowired private UpdateService updateService;

  public int getCourseDataStaleThresholdMinutes() {
    return courseDataStaleThresholdMinutes;
  }

  /**
   * Check if the data is stale for a given subject area and quarter
   *
   * @param subjectArea e.g. CMPSC
   * @param quarterYYYYQ e.g. 20221 for Winter 2022
   * @return true if the data is stale, false otherwise
   * @throws Exception
   */
  public boolean isStale(String subjectArea, String quarterYYYYQ) throws Exception {

    Optional<LocalDateTime> lastUpdateOptional =
        updateService.getLastUpdate(subjectArea, quarterYYYYQ);
    if (lastUpdateOptional.isEmpty()) {
      return true; // no update found, so data has never been loaded
    }
    LocalDateTime lastUpdate = lastUpdateOptional.get();

    String currentQuarterYYYYQ = ucsbApiQuarterService.getCurrentQuarterYYYYQ();

    // is the quarter in the past?
    if (quarterYYYYQ.compareTo(currentQuarterYYYYQ) < 0) {
      // this quarter is in the past
      // check if the last update was after last day of that quarter
      Optional<UCSBAPIQuarter> optionalQuarter =
          ucsbApiQuarterRepository.findByQuarter(quarterYYYYQ);
      if (optionalQuarter.isEmpty()) {
        return true; // quarter not found
      }
      // Data is stale if the last update was before the last day of the quarter
      UCSBAPIQuarter quarter = optionalQuarter.get();
      LocalDateTime lastDayOfQuarter = quarter.getLastDayOfSchedule();
      return lastUpdate.isBefore(lastDayOfQuarter);
    }
    // This quarter is the current quarter or in the future
    // So data becomes stale at last update + app.

    LocalDateTime staleTime = lastUpdate.plusMinutes(courseDataStaleThresholdMinutes);
    LocalDateTime now = LocalDateTime.now();
    return now.isAfter(staleTime);
  }
}
