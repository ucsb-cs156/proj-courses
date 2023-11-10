package edu.ucsb.cs156.courses.jobs;

import com.fasterxml.jackson.core.JsonProcessingException;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.models.Quarter;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@Slf4j
public class UpdateCourseDataRangeOfQuartersJob implements JobContextConsumer {

  @Getter private String start_quarterYYYYQ;
  @Getter private String end_quarterYYYYQ;
  @Getter private UCSBCurriculumService ucsbCurriculumService;
  @Getter private ConvertedSectionCollection convertedSectionCollection;
  @Getter private List<String> subjects;

  @Override
  public void accept(JobContext ctx) throws Exception {
    List<Quarter> quarters = Quarter.quarterList(start_quarterYYYYQ, end_quarterYYYYQ);
    for (Quarter quarter : quarters) {
      String quarterYYYYQ = quarter.getYYYYQ();
      for (String subjectArea : subjects) {
        updateCourses(
            ctx, quarterYYYYQ, subjectArea, ucsbCurriculumService, convertedSectionCollection);
      }
    }
  }

  public static void updateCourses(
      JobContext ctx,
      String quarterYYYYQ,
      String subjectArea,
      UCSBCurriculumService ucsbCurriculumService,
      ConvertedSectionCollection convertedSectionCollection)
      throws JsonProcessingException {
    ctx.log("Updating courses for [" + subjectArea + " " + quarterYYYYQ + "]");

    List<ConvertedSection> convertedSections =
        ucsbCurriculumService.getConvertedSections(subjectArea, quarterYYYYQ, "A");

    ctx.log("Found " + convertedSections.size() + " sections");
    ctx.log("Storing in MongoDB Collection...");

    int newSections = 0;
    int updatedSections = 0;
    int errors = 0;

    for (ConvertedSection section : convertedSections) {
      try {
        String qtr = section.getCourseInfo().getQuarter();
        String enrollCode = section.getSection().getEnrollCode();
        Optional<ConvertedSection> optionalSection =
            convertedSectionCollection.findOneByQuarterAndEnrollCode(qtr, enrollCode);
        if (optionalSection.isPresent()) {
          ConvertedSection existingSection = optionalSection.get();
          existingSection.setCourseInfo(section.getCourseInfo());
          existingSection.setSection(section.getSection());
          convertedSectionCollection.save(existingSection);
          updatedSections++;
        } else {
          convertedSectionCollection.save(section);
          newSections++;
        }
      } catch (Exception e) {
        ctx.log("Error saving section: " + e.getMessage());
        errors++;
      }
    }

    ctx.log(
        String.format(
            "%d new sections saved, %d sections updated, %d errors",
            newSections, updatedSections, errors));
    ctx.log("Courses for [" + subjectArea + " " + quarterYYYYQ + "] have been updated");
  }
}
