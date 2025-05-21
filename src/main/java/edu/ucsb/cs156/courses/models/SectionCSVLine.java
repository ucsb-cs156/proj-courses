package edu.ucsb.cs156.courses.models;

import edu.ucsb.cs156.courses.documents.ConvertedSection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.IOException;
import java.io.Writer;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SectionCSVLine {

  private String quarter;
  private String courseId;
  private String section;
  private String instructor;
  private String enrolled;
  private String maxEnroll;
  private String status;
  private String ges;

  public static String intToStringWithDefault(Integer i) {
    return i == null ? "0" : i.toString();
  }

  public static SectionCSVLine toSectionCSVLine(ConvertedSection cs) {
    return SectionCSVLine.builder()
        .quarter(cs.getCourseInfo().getQuarter())
        .courseId(cs.getCourseInfo().getCourseId())
        .section(cs.getSection().getSection())
        .enrolled(intToStringWithDefault(cs.getSection().getEnrolledTotal()))
        .maxEnroll(intToStringWithDefault(cs.getSection().getMaxEnroll()))
        .instructor(cs.getSection().instructorList())
        .status(cs.getSection().status())
        .ges(cs.getCourseInfo().ges())
        .build();
  }
}
