package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.collections.UpdateCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.Update;
import edu.ucsb.cs156.courses.models.Quarter;
import edu.ucsb.cs156.courses.services.IsStaleService;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Builder
@Getter
@AllArgsConstructor
@Slf4j
public class UpdateCourseDataJob implements JobContextConsumer {
  private String start_quarterYYYYQ;
  private String end_quarterYYYYQ;
  private List<String> subjects;
  private UCSBCurriculumService ucsbCurriculumService;
  private ConvertedSectionCollection convertedSectionCollection;
  private UpdateCollection updateCollection;
  private IsStaleService isStaleService;
  private boolean ifStale;

  public String subjectsAsString(List<String> subjects) {
    if (subjects.size() <= 1) return subjects.toString();
    else return "[" + subjects.get(0) + " ... " + subjects.get(subjects.size() - 1) + "]";
  }

  @Override
  public void accept(JobContext ctx) throws Exception {
    ctx.log(
        "Updating course data from ["
            + start_quarterYYYYQ
            + "] to ["
            + end_quarterYYYYQ
            + "] for "
            + subjectsAsString(subjects));
    if (ifStale) {
      ctx.log("Only updating stale data");
    }
    ctx.logNoCR("Updating:");
    List<Quarter> quarters = Quarter.quarterList(start_quarterYYYYQ, end_quarterYYYYQ);
    for (Quarter quarter : quarters) {
      String quarterYYYYQ = quarter.getYYYYQ();
      for (String subjectArea : subjects) {
        boolean isStale = isStaleService.isStale(subjectArea, quarterYYYYQ);
        if (ifStale && !isStale) {
          continue;
        }
        updateCourses(ctx, quarterYYYYQ, subjectArea);
      }
    }
    ctx.log("");
    ctx.log(
        "Done updating course data from ["
            + start_quarterYYYYQ
            + "] to ["
            + end_quarterYYYYQ
            + "] for "
            + subjectsAsString(subjects));
  }

  public Update updateUpdatesCollection(
      String quarterYYYYQ, String subjectArea, int saved, int updated, int errors) {
    Update update = new Update(null, subjectArea, quarterYYYYQ, saved, updated, errors, null);
    Update savedUpdate = updateCollection.save(update);
    return savedUpdate;
  }

  public void updateCourses(JobContext ctx, String quarterYYYYQ, String subjectArea)
      throws Exception {
    ctx.logNoCR(" [" + subjectArea + " " + quarterYYYYQ + "]");

    List<ConvertedSection> convertedSections =
        ucsbCurriculumService.getConvertedSections(subjectArea, quarterYYYYQ, "A");

    int newSections = 0;
    int updatedSections = 0;
    int errors = 0;

    for (ConvertedSection section : convertedSections) {
      try {
        String quarter = section.getCourseInfo().getQuarter();
        String enrollCode = section.getSection().getEnrollCode();
        Optional<ConvertedSection> optionalSection =
            convertedSectionCollection.findOneByQuarterAndEnrollCode(quarter, enrollCode);
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
        ctx.log(" Error saving section: " + e.getMessage());
        errors++;
      }
    }

    updateUpdatesCollection(quarterYYYYQ, subjectArea, newSections, updatedSections, errors);
  }
}
