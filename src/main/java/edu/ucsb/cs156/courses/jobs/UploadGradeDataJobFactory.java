package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;
import edu.ucsb.cs156.courses.services.GradeHistoryImportServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UploadGradeDataJobFactory {

  @Autowired GradeHistoryRepository gradeHistoryRepository;

  @Autowired GradeHistoryImportServiceImpl gradeHistoryImportServiceImpl;

  public UploadGradeDataJob create() {
    return new UploadGradeDataJob(gradeHistoryRepository, gradeHistoryImportServiceImpl);
  }
}
