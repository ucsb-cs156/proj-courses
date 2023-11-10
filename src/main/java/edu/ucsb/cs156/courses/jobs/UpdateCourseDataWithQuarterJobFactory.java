package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.UCSBSubjectsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UpdateCourseDataWithQuarterJobFactory {

  @Autowired private UCSBSubjectsService ucsbSubjectService;

  @Autowired private UCSBCurriculumService ucsbCurriculumService;

  @Autowired private ConvertedSectionCollection convertedSectionCollection;

  public UpdateCourseDataWithQuarterJob create(String quarterYYYYQ) {
    log.info("ucsbSubjectService = " + ucsbSubjectService);
    log.info("ucsbCurriculumService = " + ucsbCurriculumService);
    log.info("convertedSectionCollection = " + convertedSectionCollection);
    return new UpdateCourseDataWithQuarterJob(
        quarterYYYYQ, ucsbSubjectService, ucsbCurriculumService, convertedSectionCollection);
  }
}
