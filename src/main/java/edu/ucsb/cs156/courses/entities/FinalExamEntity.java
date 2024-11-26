package edu.ucsb.cs156.courses.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "final_exam")
public class FinalExamEntity {
  @Id private String quarterYYYYQEnrollCd;
  private Boolean hasFinals;
  private String comments;
  private LocalDateTime finalExamStart;
  private LocalDateTime finalExamEnd;
}
