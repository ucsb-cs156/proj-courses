package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobsRepository extends CrudRepository<Job, Long> {
  Page<Job> findAll(Pageable pageable);
}
