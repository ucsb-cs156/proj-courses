package edu.ucsb.cs156.courses.documents;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@NoArgsConstructor
@Slf4j
public class CoursePage {
  private int pageNumber;
  private int pageSize;
  private int total;
  private List<Course> classes;

  /**
   * Create a CoursePage object from json representation
   *
   * @param json String of json returned by API endpoint {@code /classes/search}
   * @return a new CoursePage object
   * @see <a href=
   *     "https://developer.ucsb.edu/content/academic-curriculums">https://developer.ucsb.edu/content/academic-curriculums</a>
   */
  public static CoursePage fromJSON(String json) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

      CoursePage coursePage = objectMapper.readValue(json, CoursePage.class);
      return coursePage;
    } catch (JsonProcessingException jpe) {
      log.error("JsonProcessingException:" + jpe);
      return null;
    }
  }

  /**
   * Create a List of ConvertedSections from json representation
   *
   * @return a list of converted sections
   */
  public List<ConvertedSection> convertedSections() {

    List<ConvertedSection> result = new ArrayList<ConvertedSection>();

    for (Course c : this.getClasses()) {
      for (Section section : c.getClassSections()) {
        int lectureNum = Integer.parseInt(section.getSection()) / 100;

        CourseInfo courseInfo =
            CourseInfo.builder()
                .quarter(c.getQuarter())
                .courseId(c.getCourseId() + "-" + Integer.toString(lectureNum))
                .title(c.getTitle())
                .description(c.getDescription())
                .generalEducation(c.getGeneralEducation())
                .build();
        ConvertedSection cs =
            ConvertedSection.builder().courseInfo(courseInfo).section(section).build();
        result.add(cs);
      }
    }
    return result;
  }

  /**
   * Look ahead to the next section if there is one
   *
   * @param sections List of sections
   * @param sectionIndex the index of the current section
   * @return the next section if it exists, otherwise null
   */
  public static Section nextSection(List<Section> sections, int sectionIndex) {
    if (sectionIndex + 1 < sections.size()) {
      return sections.get(sectionIndex + 1);
    }
    return null; // No more sections to look at
  }

  /**
   * Given a Course, return a list of Primary objects.
   *
   * <p>The reason this is necessary is that the UCSB API returns a course with a list of sections.
   * However, that list of sections may contain multiple primary sections, each with its own set of
   * secondary sections.
   *
   * <p>This method processes the sections of a course to create a list of Primary objects, each
   * representing a primary section and its associated secondary sections.
   *
   * @return a list of Primary objects
   */
  public static List<Primary> getListOfPrimaries(Course course) {
    List<Primary> result = new ArrayList<>();
    List<Section> classSections = course.getClassSections();

    if (classSections.isEmpty()) {
      return Collections.emptyList(); // No sections to process
    }

    Section firstSection = classSections.get(0);
    if (!firstSection.isPrimary()) {
      log.error("First section is not primary: {}", firstSection);
      return Collections.emptyList(); // No sections to process
    }

    int sectionIndex = 0;
    Section thisSection = classSections.get(sectionIndex);

    while (thisSection != null) {
      List<Section> secondaries = new ArrayList<>();
      Section lookAhead = nextSection(classSections, sectionIndex);

      while (lookAhead != null && !lookAhead.isPrimary()) {
        secondaries.add(lookAhead);
        sectionIndex++;
        lookAhead = nextSection(classSections, sectionIndex);
      }

      Primary primary =
          Primary.builder()
              .quarter(course.getQuarter())
              .courseId(course.getCourseId())
              .title(course.getTitle())
              .description(course.getDescription())
              .primary(thisSection)
              .subRows(secondaries)
              .generalEducation(course.getGeneralEducation())
              .build();
      result.add(primary);
      thisSection = nextSection(classSections, sectionIndex);
      sectionIndex++; // Move to the next section
    }
    return result;
  }

  /** Get a list of Primary objects from the CoursePage */
  public List<Primary> getPrimaries() {
    List<Primary> result = new ArrayList<>();

    for (Course c : this.getClasses()) {
      List<Primary> primaries = getListOfPrimaries(c);
      result.addAll(primaries);
    }
    return result;
  }
}
