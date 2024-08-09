package edu.ucsb.cs156.courses.entities;

import java.time.LocalDateTime;

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
@Entity(name = "ucsbapiquarter")
public class UCSBAPIQuarter {
  @Id  
  private String quarter; // example: 20243
  private String qyy; // example: M24
  private String name; // example: SUMMER 2024
  private String category; // example: SUMMER
  private String academicYear; // example: 2023-2024
  private LocalDateTime firstDayOfClasses; // example: 2024-06-24T00:00:00
  private LocalDateTime lastDayOfClasses; // example: 2024-09-13T00:00:00
  private LocalDateTime firstDayOfFinals; // example: 2024-09-14T00:00:00
  private LocalDateTime lastDayOfFinals; // example: 2024-09-14T00:00:00
  private LocalDateTime firstDayOfQuarter; // example: 2024-06-24T00:00:00
  private LocalDateTime lastDayOfSchedule; // example: 2024-09-21T00:00:00
  private LocalDateTime pass1Begin; // example: 2024-04-08T09:00:00
  private LocalDateTime pass2Begin; // example: 2024-04-22T09:00:00
  private LocalDateTime pass3Begin; // example: 2024-05-06T09:00:00
  private LocalDateTime feeDeadline; // example: 2024-06-26T00:00:00
  private LocalDateTime lastDayToAddUnderGrad; // example: 2024-07-15T00:00:00
  private LocalDateTime lastDayToAddGrad; // example: 2024-09-13T00:00:00
  private LocalDateTime lastDayThirdWeek; // example: null

  public static final String SAMPLE_QUARTER_JSON =
      """
            {
                "quarter": "20243",
                "qyy": "M24",
                "name": "SUMMER 2024",
                "category": "SUMMER",
                "academicYear": "2023-2024",
                "firstDayOfClasses": "2024-06-24T00:00:00",
                "lastDayOfClasses": "2024-09-13T00:00:00",
                "firstDayOfFinals": "2024-09-14T00:00:00",
                "lastDayOfFinals": "2024-09-14T00:00:00",
                "firstDayOfQuarter": "2024-06-24T00:00:00",
                "lastDayOfSchedule": "2024-09-21T00:00:00",
                "pass1Begin": "2024-04-08T09:00:00",
                "pass2Begin": "2024-04-22T09:00:00",
                "pass3Begin": "2024-05-06T09:00:00",
                "feeDeadline": "2024-06-26T00:00:00",
                "lastDayToAddUnderGrad": "2024-07-15T00:00:00",
                "lastDayToAddGrad": "2024-09-13T00:00:00",
                "lastDayThirdWeek": null
            }
            """;
}
