package edu.ucsb.cs156.courses.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import edu.ucsb.cs156.courses.entities.UCSBSubject;

@Repository
public interface UCSBSubjectRepository extends CrudRepository<UCSBSubject, String>{
}