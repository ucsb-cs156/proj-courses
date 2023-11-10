package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.UCSBSubject;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UCSBSubjectRepository extends CrudRepository<UCSBSubject, String> {}
