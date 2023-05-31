package edu.ucsb.cs156.courses.collections;

import java.util.Optional;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import edu.ucsb.cs156.courses.documents.ConvertedSection;

@Repository
public interface ConvertedSectionCollection extends MongoRepository<ConvertedSection, ObjectId> {
    @Query("{'courseInfo.quarter': ?0, 'section.enrollCode': ?1}")
    Optional<ConvertedSection> findOneByQuarterAndEnrollCode(String quarter, String enrollCode);

    @Query("{'courseInfo.quarter': { $gte: ?0, $lte: ?1 }, 'courseInfo.courseId': { $regex: ?2 } }")
    List<ConvertedSection> findByQuarterRangeAndCourseId(
        String startQuarter,
        String endQuarter,
        String courseId );
        
    @Query("{'courseInfo.quarter': {$gte: ?0, $lte: ?1}, 'section.instructors.instructor': {$regex: ?2, $options: 'i'} }")
    List<ConvertedSection> findByQuarterRangeAndInstructor(
        String startQuarter,
        String endQuarter,
        String instructor );
    
     @Query("{'courseInfo.quarter': { $gte: ?0, $lte: ?1 }, 'section.timeLocations.building': { $regex: ?2, $options: 'i' } }")
     List<ConvertedSection> findByQuarterRangeAndBuildingCode(
        String startQuarter, 
        String endQuarter, 
        String buildingCode );
}
