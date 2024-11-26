package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.FinalExamEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinalExamRepository extends CrudRepository<FinalExamEntity, String> {}
