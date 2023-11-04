package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;
import edu.ucsb.cs156.courses.services.UCSBGradeHistoryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UploadGradeDataJobFactory {

  @Autowired UCSBGradeHistoryServiceImpl ucsbGradeHistoryServiceImpl;

  @Autowired GradeHistoryRepository gradeHistoryRepository;

  public UploadGradeDataJob create() {
    return new UploadGradeDataJob(ucsbGradeHistoryServiceImpl, gradeHistoryRepository);
  }
}
