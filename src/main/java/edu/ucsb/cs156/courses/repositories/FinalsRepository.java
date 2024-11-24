package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.FinalsEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinalsRepository extends CrudRepository<FinalsEntity, String> {}
