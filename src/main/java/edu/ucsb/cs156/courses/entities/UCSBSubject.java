package edu.ucsb.cs156.courses.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "ucsb_subjects")
public class UCSBSubject {
  @Id private String subjectCode;
  private String subjectTranslation;
  private String deptCode;
  private String collegeCode;
  private String relatedDeptCode;
  private boolean inactive;
}
