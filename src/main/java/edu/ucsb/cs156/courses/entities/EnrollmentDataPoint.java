package edu.ucsb.cs156.courses.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

/**
 * GradeHistory - Entity for grade history data. Each object represents one row from the CSV files
 * located in this repository: <a href=
 * "https://github.com/rtora/UCSB_Grades">https://github.com/rtora/UCSB_Grades</a>
 *
 * <p>There is a unique constraint on the combination of year, quarter, subjectArea, course,
 * instructor, and grade, since we do not want duplicate rows of data for the same course.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "enrollmentdatapoint")
public class EnrollmentDataPoint {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String yyyyq;
  private String enrollCd;
  private String courseId; // redundant but useful for querying since enrollCd is in Mongo
  private String section; // redundant but useful for querying since enrollCd is in Mongo
  private int enrollment;

  @CreatedDate
  @Column(updatable = false)
  private LocalDateTime dateCreated;
}
