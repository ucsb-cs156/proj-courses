package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.collections.UpdateCollection;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.courses.services.IsStaleService;
import edu.ucsb.cs156.courses.services.UCSBAPIQuarterService;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UpdateCourseDataJobFactory {

  @Autowired private UCSBCurriculumService curriculumService;

  @Autowired private ConvertedSectionCollection convertedSectionCollection;

  @Autowired private UCSBSubjectRepository subjectRepository;

  @Autowired private UpdateCollection updateCollection;

  @Autowired private IsStaleService isStaleService;

  @Autowired private EnrollmentDataPointRepository enrollmentDataPointRepository;

  @Autowired private UCSBAPIQuarterService ucsbapiQuarterService;

  public UpdateCourseDataJob createForSubjectAndQuarter(String subjectArea, String quarterYYYYQ) {
    return new UpdateCourseDataJob(
        quarterYYYYQ,
        quarterYYYYQ,
        List.of(subjectArea),
        curriculumService,
        convertedSectionCollection,
        updateCollection,
        isStaleService,
        false,
        enrollmentDataPointRepository,
        ucsbapiQuarterService
        );
  }

  public UpdateCourseDataJob createForSubjectAndQuarterAndIfStale(
      String subjectArea, String quarterYYYYQ, boolean ifStale) {
    return new UpdateCourseDataJob(
        quarterYYYYQ,
        quarterYYYYQ,
        List.of(subjectArea),
        curriculumService,
        convertedSectionCollection,
        updateCollection,
        isStaleService,
        ifStale,
        enrollmentDataPointRepository,
        ucsbapiQuarterService
        );
  }

  public UpdateCourseDataJob createForSubjectAndQuarterRange(
      String subjectArea, String start_quarterYYYYQ, String end_quarterYYYYQ) {
    return new UpdateCourseDataJob(
        start_quarterYYYYQ,
        end_quarterYYYYQ,
        List.of(subjectArea),
        curriculumService,
        convertedSectionCollection,
        updateCollection,
        isStaleService,
        true,
        enrollmentDataPointRepository,
        ucsbapiQuarterService
        );
  }

  private List<String> getAllSubjectCodes() {
    var subjects = subjectRepository.findAll();
    var subjectCodes = new ArrayList<String>();
    for (var subject : subjects) {
      subjectCodes.add(subject.getSubjectCode());
    }
    return subjectCodes;
  }

  public UpdateCourseDataJob createForQuarter(String quarterYYYYQ) {
    return new UpdateCourseDataJob(
        quarterYYYYQ,
        quarterYYYYQ,
        getAllSubjectCodes(),
        curriculumService,
        convertedSectionCollection,
        updateCollection,
        isStaleService,
        true,
        enrollmentDataPointRepository,
        ucsbapiQuarterService
        );
  }

  public UpdateCourseDataJob createForQuarterRange(
      String start_quarterYYYYQ, String end_quarterYYYYQ) {
    return new UpdateCourseDataJob(
        start_quarterYYYYQ,
        end_quarterYYYYQ,
        getAllSubjectCodes(),
        curriculumService,
        convertedSectionCollection,
        updateCollection,
        isStaleService,
        true,
        enrollmentDataPointRepository,
        ucsbapiQuarterService
        );
  }
}
