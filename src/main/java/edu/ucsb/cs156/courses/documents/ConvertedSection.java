package edu.ucsb.cs156.courses.documents;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "courses")
public class ConvertedSection {
  private ObjectId _id;
  private CourseInfo courseInfo;
  private Section section;

  @Override
  public Object clone() throws CloneNotSupportedException {

    ConvertedSection newConvertedSection = new ConvertedSection();

    newConvertedSection.set_id(this._id);

    CourseInfo newCourseInfo = (CourseInfo) this.getCourseInfo().clone();
    newConvertedSection.setCourseInfo(newCourseInfo);

    Section newSection = (Section) this.getSection().clone();
    newConvertedSection.setSection(newSection);

    return newConvertedSection;
  }

  @JsonIgnore
  public EnrollmentDataPoint getEnrollmentDataPoint() {
    EnrollmentDataPoint edp =
        EnrollmentDataPoint.builder()
            .yyyyq(this.getCourseInfo().getQuarter())
            .enrollCd(this.getSection().getEnrollCode())
            .enrollment(this.getSection().getEnrolledTotal())
            .courseId(this.getCourseInfo().getCourseId())
            .section(this.getSection().getSection())
            .build();
    return edp;
  }

  public static class ConvertedSectionSortDescendingByQuarterComparator
      implements java.util.Comparator<ConvertedSection> {
    @Override
    public int compare(ConvertedSection o1, ConvertedSection o2) {
      return o2.getCourseInfo().getQuarter().compareTo(o1.getCourseInfo().getQuarter());
    }
  }

  @JsonIgnore
  public String getDays() {
    if (this.getSection().getTimeLocations() == null) {
      return "";
    }
    return this.getSection().getTimeLocations().stream()
        .map(timeLocation -> timeLocation.getDays())
        .collect(Collectors.joining(", "));
  }

  @JsonIgnore
  public String getBeginTimes() {
    if (this.getSection().getTimeLocations() == null) {
      return "";
    }
    return this.getSection().getTimeLocations().stream()
        .map(timeLocation -> timeLocation.getBeginTime())
        .collect(Collectors.joining(", "));
  }

  @JsonIgnore
  public String getLocations() {
    if (this.getSection().getTimeLocations() == null) {
      return "";
    }
    return this.getSection().getTimeLocations().stream()
        .map(timeLocation -> timeLocation.getBuilding() + " " + timeLocation.getRoom())
        .collect(Collectors.joining(", "));
  }
}
