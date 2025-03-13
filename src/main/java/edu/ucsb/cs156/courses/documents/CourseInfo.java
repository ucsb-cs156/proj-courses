package edu.ucsb.cs156.courses.documents;

import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CourseInfo is an object that stores all of the information about a course from the UCSB Courses
 * API except for the section info
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseInfo implements Cloneable {
  private String quarter;
  private String courseId;
  private String title;
  private String description;
  private List<GeneralEducation> generalEducation;

  public String ges() {
    if (generalEducation == null) {
      return "";
    }

    List<String> gesAsListOfStrings =
        generalEducation.stream()
            .map(GeneralEducation::toString)
            .map(String::trim)
            .collect(Collectors.toList());
    return String.join(", ", gesAsListOfStrings);
  }

  public Object clone() throws CloneNotSupportedException {
    CourseInfo newCourseInfo = (CourseInfo) super.clone();
    return newCourseInfo;
  }
}
