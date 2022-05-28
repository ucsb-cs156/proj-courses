package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.Courses;
// import edu.ucsb.cs156.courses.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CoursesRepository extends CrudRepository<Courses, Long> {
  Optional<Courses> findByPsId(Long psId);
  Optional<Courses> findById(Long id);
  Iterable<Courses> findAllByPsId(Long psId);
}