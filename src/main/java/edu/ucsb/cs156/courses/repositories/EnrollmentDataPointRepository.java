package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentDataPointRepository extends CrudRepository<EnrollmentDataPoint, Long> {
 
}
