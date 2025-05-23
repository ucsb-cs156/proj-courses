package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobsRepository extends JpaRepository<Job, Long> {}
