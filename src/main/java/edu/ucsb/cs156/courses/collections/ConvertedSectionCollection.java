package edu.ucsb.cs156.courses.collections;

import edu.ucsb.cs156.courses.documents.ConvertedSection;
import java.util.List;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConvertedSectionCollection extends MongoRepository<ConvertedSection, ObjectId> {
  @Query("{'courseInfo.quarter': ?0, 'section.enrollCode': ?1}")
  Optional<ConvertedSection> findOneByQuarterAndEnrollCode(String quarter, String enrollCode);

  @Query("{'courseInfo.quarter': { $gte: ?0, $lte: ?1 }, 'courseInfo.courseId': { $regex: ?2 } }")
  List<ConvertedSection> findByQuarterRangeAndCourseId(
      String startQuarter, String endQuarter, String courseId);

  @Query(
      "{'courseInfo.quarter': {$gte: ?0, $lte: ?1}, 'section.instructors': { '$elemMatch': { 'instructor': { $regex: ?2 }, 'functionCode': { $regex: ?3 }}}}")
  List<ConvertedSection> findByQuarterRangeAndInstructor(
      String startQuarter, String endQuarter, String instructor, String functionCode);

  @Query(
      "{'courseInfo.quarter': { $gte: ?0, $lte: ?1 }, 'section.timeLocations.building': { $regex: ?2, $options: 'i' } }")
  List<ConvertedSection> findByQuarterRangeAndBuildingCode(
      String startQuarter, String endQuarter, String buildingCode);

  @Query(
      "{'courseInfo.quarter': { $eq: ?0 }, 'section.timeLocations.building': { $regex: ?1, $options: 'i' } }")
  List<ConvertedSection> findByQuarterAndBuildingCode(String quarter, String buildingCode);

  @Query("{'courseInfo.quarter': { $eq: ?0 } }")
  List<ConvertedSection> findByQuarter(String quarter);

  /**
   * Find sections by quarter and subject area.
   *
   * @param quarter Quarter in yyyyq format
   * @param subjectArea regex (first eight should be subjectArea, then next character determines
   *     level; e.g. ' ' for lower div ugrad, 1 for upper div ugrad, 2 or above for grad)
   * @param sectionRegex use `00$` to omit sections or `.*` for all sections
   * @param minTimeLocations use 0 for all courses (including independent studies), 1 for only
   *     course that have a time and/or locations assigned
   * @return
   */
  @Query(
      "{'courseInfo.quarter': { $eq: ?0 }, 'courseInfo.courseId': { $regex: ?1 }, 'section.section': { $regex: ?2 }, $expr: { $gte: [ { $size: '$section.timeLocations' }, ?3 ] } }")
  List<ConvertedSection> findByQuarterAndSubjectArea(
      String quarter, String subjectArea, String sectionRegex, int minTimeLocations);
}
