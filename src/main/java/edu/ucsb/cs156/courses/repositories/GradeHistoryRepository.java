package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.GradeHistory;
import java.util.List;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface GradeHistoryRepository extends JpaRepository<GradeHistory, Long> {
  public List<GradeHistory> findByYyyyqAndCourseAndInstructorAndGrade(
      String yyyyq, String course, String instructor, String grade);

  public List<GradeHistory> findByCourse(String course);
}
