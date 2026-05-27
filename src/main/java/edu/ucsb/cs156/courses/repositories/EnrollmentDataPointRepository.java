package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentDataPointRepository extends CrudRepository<EnrollmentDataPoint, Long> {
  Iterable<EnrollmentDataPoint> findByYyyyq(String yyyyq);

  @Query(
      """
      SELECT e FROM enrollmentdatapoint e
      WHERE e.yyyyq >= :startQtr
        AND e.yyyyq <= :endQtr
        AND e.courseId LIKE CONCAT(:courseId, '%')
        AND (:enrollCd IS NULL OR e.enrollCd = :enrollCd)
        AND (:section IS NULL OR e.section = :section)
      ORDER BY e.dateCreated ASC, e.yyyyq ASC, e.courseId ASC, e.section ASC, e.enrollCd ASC, e.id ASC
      """)
  List<EnrollmentDataPoint> findByQuarterRangeAndCourseIdAndOptionalFilters(
      @Param("startQtr") String startQtr,
      @Param("endQtr") String endQtr,
      @Param("courseId") String courseId,
      @Param("enrollCd") String enrollCd,
      @Param("section") String section);
}
