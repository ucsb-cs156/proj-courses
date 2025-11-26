package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
  Optional<User> findByEmail(String email);

  Page<User> findAll(Pageable pageable);
}
