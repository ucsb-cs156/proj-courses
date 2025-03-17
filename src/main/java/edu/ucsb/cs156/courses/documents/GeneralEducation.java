package edu.ucsb.cs156.courses.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneralEducation {
  private String geCode;
  private String geCollege;

  public String toString() {
    if (geCode == null) {
      return "";
    }
    if (geCollege == null) {
      return geCode.trim();
    }
    return geCode.trim() + " (" + geCollege.trim() + ")";
  }
}
