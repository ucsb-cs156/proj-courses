package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.UCSBGE;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UCSBGERepository extends CrudRepository<UCSBGE, String> {}
