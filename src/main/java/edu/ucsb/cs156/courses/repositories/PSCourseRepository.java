package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.PSCourse;
import edu.ucsb.cs156.courses.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PSCourseRepository extends CrudRepository<PSCourse, Long> {
  Optional<PSCourse> findByPsId(Long psId);
  Optional<PSCourse> findById(Long id);
  Optional<PSCourse> findByIdAndUser(long id, User user);

  Iterable<PSCourse> findAllByPsId(Long psId);
  Iterable<PSCourse> findAllByPsIdAndUser(Long psId, User user);
  Iterable<PSCourse> findAllByUserId(Long user_id);
}