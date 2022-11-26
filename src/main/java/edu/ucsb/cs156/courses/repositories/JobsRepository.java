package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.Job;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobsRepository extends CrudRepository<Job, Long> {

}
