package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.PersonalSchedule;
import edu.ucsb.cs156.example.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PersonalScheduleRepository extends CrudRepository<PersonalSchedule, Long> {
  Optional<PersonalSchedule> findByIdAndUser(long id, User user);
  Iterable<PersonalSchedule> findAllByUserId(Long user_id);
}