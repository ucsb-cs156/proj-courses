package edu.ucsb.cs156.courses.documents;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.mapping.Document;

@Slf4j
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "primaries")
public class Primary {
  private String quarter;
  private String courseId;
  private String title;
  private String description;
  private Section primary;
  private List<Section> subRows;
  private List<GeneralEducation> generalEducation;

  /**
   * Convert a flat list of {@link ConvertedSection} objects into a list of Primary objects, where
   * each Primary contains a primary section (e.g. a lecture) and its secondary sections (e.g.
   * discussion sections) as subRows. The result is sorted by quarter descending, and within a
   * quarter, by section number ascending, so that secondary sections immediately follow their
   * primary section.
   *
   * @param convertedSections a flat list of ConvertedSection objects
   * @return a list of Primary objects
   */
  public static List<Primary> fromConvertedSections(List<ConvertedSection> convertedSections) {
    List<ConvertedSection> sorted = new ArrayList<>(convertedSections);
    sorted.sort(
        Comparator.comparing(
                (ConvertedSection cs) -> cs.getCourseInfo().getQuarter(),
                Comparator.nullsLast(Comparator.reverseOrder()))
            .thenComparing(
                cs -> cs.getSection().getSection(),
                Comparator.nullsLast(Comparator.naturalOrder())));

    List<Primary> result = new ArrayList<>();
    Primary current = null;
    for (ConvertedSection cs : sorted) {
      CourseInfo courseInfo = cs.getCourseInfo();
      Section section = cs.getSection();
      boolean sameCourse =
          current != null
              && java.util.Objects.equals(current.getQuarter(), courseInfo.getQuarter())
              && java.util.Objects.equals(current.getCourseId(), courseInfo.getCourseId());
      if (section.isPrimary() || !sameCourse) {
        current =
            Primary.builder()
                .quarter(courseInfo.getQuarter())
                .courseId(courseInfo.getCourseId())
                .title(courseInfo.getTitle())
                .description(courseInfo.getDescription())
                .primary(section)
                .subRows(new ArrayList<>())
                .generalEducation(courseInfo.getGeneralEducation())
                .build();
        result.add(current);
      } else {
        current.getSubRows().add(section);
      }
    }
    return result;
  }
}
