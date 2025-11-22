package edu.ucsb.cs156.courses.models;

import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentCSV {

  private Long id;
  private String yyyyq;
  private String enrollCd;
  private String courseId;
  private String section;
  private int enrollment;
  private LocalDateTime dateCreated;

  public static EnrollmentCSV fromEntity(EnrollmentDataPoint edp) {
    return EnrollmentCSV.builder()
        .id(edp.getId())
        .yyyyq(edp.getYyyyq())
        .enrollCd(edp.getEnrollCd())
        .courseId(edp.getCourseId())
        .section(edp.getSection())
        .enrollment(edp.getEnrollment())
        .dateCreated(edp.getDateCreated())
        .build();
  }
}
