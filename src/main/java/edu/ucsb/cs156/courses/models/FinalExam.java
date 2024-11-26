package edu.ucsb.cs156.courses.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FinalExam {
    private Boolean hasFinals;
    private String comments;
    private String examDay;
    private String examDate;
    private String beginTime;
    private String endTime;
}
