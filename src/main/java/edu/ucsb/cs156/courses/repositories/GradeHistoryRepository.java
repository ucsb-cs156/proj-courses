package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.entities.GradeHistory;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeHistoryRepository extends CrudRepository<GradeHistory, Long> {
    public List<GradeHistory> findByYyyyqAndCourseAndInstructorAndGrade(String yyyyq, String course, String instructor, String grade);

    public List<GradeHistory> findByCourse(String course);

}
