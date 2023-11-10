package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.entities.UCSBSubject;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UpdateCourseDataRangeOfQuartersJobFactory {

  @Autowired private UCSBCurriculumService ucsbCurriculumService;

  @Autowired private ConvertedSectionCollection convertedSectionCollection;

  @Autowired private UCSBSubjectRepository subjectRepository;

  public UpdateCourseDataRangeOfQuartersJob create(
      String start_quarterYYYYQ, String end_quarterYYYYQ) {
    log.info("ucsbCurriculumService = " + ucsbCurriculumService);
    log.info("convertedSectionCollection = " + convertedSectionCollection);

    List<String> subjects = new ArrayList<String>();
    Iterable<UCSBSubject> UCSBSubjects = subjectRepository.findAll();
    for (UCSBSubject UCSBSubject : UCSBSubjects) {
      subjects.add(UCSBSubject.getSubjectCode());
    }
    return new UpdateCourseDataRangeOfQuartersJob(
        start_quarterYYYYQ,
        end_quarterYYYYQ,
        ucsbCurriculumService,
        convertedSectionCollection,
        subjects);
  }
}
