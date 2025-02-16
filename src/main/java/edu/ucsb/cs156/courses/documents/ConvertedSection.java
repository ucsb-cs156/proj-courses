package edu.ucsb.cs156.courses.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;

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
    EnrollmentDataPoint edp = EnrollmentDataPoint.builder()
        .yyyyq(this.getCourseInfo().getQuarter())
        .enrollCd(this.getSection().getEnrollCode())
        .enrollment(this.getSection().getEnrolledTotal())
        .build();
    return edp;
  }
}
