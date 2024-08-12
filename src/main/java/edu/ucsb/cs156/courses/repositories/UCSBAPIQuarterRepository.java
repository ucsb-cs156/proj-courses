package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.GradeHistory;
import edu.ucsb.cs156.courses.entities.UCSBAPIQuarter;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UCSBAPIQuarterRepository extends CrudRepository<UCSBAPIQuarter, String> {
  public Optional<UCSBAPIQuarter> findByQuarter(String quarter);
  public List<UCSBAPIQuarter> findAll();
}
