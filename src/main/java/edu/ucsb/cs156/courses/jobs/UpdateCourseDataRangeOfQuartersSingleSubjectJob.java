package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.models.Quarter;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@Slf4j
public class UpdateCourseDataRangeOfQuartersSingleSubjectJob implements JobContextConsumer {

  @Getter private String subjectArea;
  @Getter private String start_quarterYYYYQ;
  @Getter private String end_quarterYYYYQ;
  @Getter private UCSBCurriculumService ucsbCurriculumService;
  @Getter private ConvertedSectionCollection convertedSectionCollection;

  @Override
  public void accept(JobContext ctx) throws Exception {
    List<Quarter> quarters = Quarter.quarterList(start_quarterYYYYQ, end_quarterYYYYQ);
    for (Quarter quarter : quarters) {
      String quarterYYYYQ = quarter.getYYYYQ();
      UpdateCourseDataRangeOfQuartersJob.updateCourses(
          ctx, quarterYYYYQ, subjectArea, ucsbCurriculumService, convertedSectionCollection);
    }
  }
}
