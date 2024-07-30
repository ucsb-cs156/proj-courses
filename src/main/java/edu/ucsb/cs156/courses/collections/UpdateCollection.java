package edu.ucsb.cs156.courses.collections;

import edu.ucsb.cs156.courses.documents.Update;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpdateCollection extends PagingAndSortingRepository<Update, ObjectId> {
  Update save(Update update);

  Page<Update> findBySubjectAreaAndQuarter(String subjectArea, String quarter, Pageable pageable);

  Page<Update> findByQuarter(String quarter, Pageable pageable);

  Page<Update> findBySubjectArea(String subjectArea, Pageable pageable);

  Page<Update> findAll(Pageable pageable);
}
