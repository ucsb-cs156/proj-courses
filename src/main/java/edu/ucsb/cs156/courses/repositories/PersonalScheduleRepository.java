package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.PersonalSchedule;
import edu.ucsb.cs156.courses.entities.User;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalScheduleRepository extends CrudRepository<PersonalSchedule, Long> {
  Optional<PersonalSchedule> findByIdAndUser(long id, User user);

  Iterable<PersonalSchedule> findAllByUserId(Long user_id);

  Optional<PersonalSchedule> findByUserAndNameAndQuarter(User user, String name, String quarter);
}
