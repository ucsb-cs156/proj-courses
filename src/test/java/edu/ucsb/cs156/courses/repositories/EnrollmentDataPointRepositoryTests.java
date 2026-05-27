package edu.ucsb.cs156.courses.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class EnrollmentDataPointRepositoryTests {

  @Autowired EnrollmentDataPointRepository enrollmentDataPointRepository;

  @Test
  public void findByQuarterRangeAndCourseIdAndOptionalFilters_finds_course_history_in_date_order() {
    EnrollmentDataPoint later =
        dataPoint("20251", "12345", "CMPSC   130A -1", "0100", 96, "2026-01-02T09:00:00");
    EnrollmentDataPoint earlier =
        dataPoint("20252", "12345", "CMPSC   130A -1", "0100", 98, "2026-01-01T09:00:00");
    EnrollmentDataPoint middle =
        dataPoint("20252", "23456", "CMPSC   130A -2", "0200", 75, "2026-01-01T10:00:00");
    EnrollmentDataPoint wrongCourse =
        dataPoint("20252", "34567", "CMPSC   130B -1", "0100", 62, "2026-01-01T08:00:00");
    EnrollmentDataPoint tooEarlyQuarter =
        dataPoint("20244", "45678", "CMPSC   130A -1", "0100", 60, "2026-01-01T07:00:00");
    EnrollmentDataPoint tooLateQuarter =
        dataPoint("20253", "56789", "CMPSC   130A -1", "0100", 70, "2026-01-01T07:30:00");

    enrollmentDataPointRepository.saveAll(
        List.of(later, wrongCourse, earlier, tooEarlyQuarter, middle, tooLateQuarter));

    List<EnrollmentDataPoint> result =
        enrollmentDataPointRepository.findByQuarterRangeAndCourseIdAndOptionalFilters(
            "20251", "20252", "CMPSC   130A", null, null);

    assertEquals(List.of(earlier, middle, later), result);
  }

  @Test
  public void findByQuarterRangeAndCourseIdAndOptionalFilters_filters_by_enrollCd() {
    EnrollmentDataPoint matchingEnrollCd =
        dataPoint("20252", "12345", "CMPSC   130A -1", "0100", 96, "2026-01-01T09:00:00");
    EnrollmentDataPoint differentEnrollCd =
        dataPoint("20252", "23456", "CMPSC   130A -1", "0100", 98, "2026-01-01T10:00:00");

    enrollmentDataPointRepository.saveAll(List.of(matchingEnrollCd, differentEnrollCd));

    List<EnrollmentDataPoint> result =
        enrollmentDataPointRepository.findByQuarterRangeAndCourseIdAndOptionalFilters(
            "20252", "20252", "CMPSC   130A", "12345", null);

    assertEquals(List.of(matchingEnrollCd), result);
  }

  @Test
  public void findByQuarterRangeAndCourseIdAndOptionalFilters_filters_by_section() {
    EnrollmentDataPoint matchingSection =
        dataPoint("20252", "12345", "CMPSC   130A -1", "0100", 96, "2026-01-01T09:00:00");
    EnrollmentDataPoint differentSection =
        dataPoint("20252", "23456", "CMPSC   130A -1", "0200", 98, "2026-01-01T10:00:00");

    enrollmentDataPointRepository.saveAll(List.of(matchingSection, differentSection));

    List<EnrollmentDataPoint> result =
        enrollmentDataPointRepository.findByQuarterRangeAndCourseIdAndOptionalFilters(
            "20252", "20252", "CMPSC   130A", null, "0100");

    assertEquals(List.of(matchingSection), result);
  }

  @Test
  public void findByQuarterRangeAndCourseIdAndOptionalFilters_applies_both_optional_filters() {
    EnrollmentDataPoint matchingPoint =
        dataPoint("20252", "12345", "CMPSC   130A -1", "0100", 96, "2026-01-01T09:00:00");
    EnrollmentDataPoint wrongSection =
        dataPoint("20252", "12345", "CMPSC   130A -1", "0200", 98, "2026-01-01T10:00:00");
    EnrollmentDataPoint wrongEnrollCd =
        dataPoint("20252", "23456", "CMPSC   130A -1", "0100", 100, "2026-01-01T11:00:00");

    enrollmentDataPointRepository.saveAll(List.of(matchingPoint, wrongSection, wrongEnrollCd));

    List<EnrollmentDataPoint> result =
        enrollmentDataPointRepository.findByQuarterRangeAndCourseIdAndOptionalFilters(
            "20252", "20252", "CMPSC   130A", "12345", "0100");

    assertEquals(List.of(matchingPoint), result);
  }

  @Test
  public void findByQuarterRangeAndCourseIdAndOptionalFilters_returns_empty_list_when_no_match() {
    EnrollmentDataPoint dataPoint =
        dataPoint("20252", "12345", "CMPSC   130A -1", "0100", 96, "2026-01-01T09:00:00");

    enrollmentDataPointRepository.save(dataPoint);

    List<EnrollmentDataPoint> result =
        enrollmentDataPointRepository.findByQuarterRangeAndCourseIdAndOptionalFilters(
            "20252", "20252", "MATH      3B", null, null);

    assertTrue(result.isEmpty());
  }

  private EnrollmentDataPoint dataPoint(
      String yyyyq,
      String enrollCd,
      String courseId,
      String section,
      int enrollment,
      String dateCreated) {
    return EnrollmentDataPoint.builder()
        .yyyyq(yyyyq)
        .enrollCd(enrollCd)
        .courseId(courseId)
        .section(section)
        .enrollment(enrollment)
        .dateCreated(LocalDateTime.parse(dateCreated))
        .build();
  }
}
