package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.Courses;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoursesRepository extends CrudRepository<Courses, Long> {
  
}