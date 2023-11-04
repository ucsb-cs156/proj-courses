package edu.ucsb.cs156.courses.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinalExam {
  private boolean hasFinals;
  private String comments;
  private String examDay;
  private String examDate;
  private String beginTime;
  private String endTime;
}
