package edu.ucsb.cs156.courses.documents;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GERequirement {
  @JsonProperty("requirementCode")
  private String requirementCode;

  @JsonProperty("requirementTranslation")
  private String requirementTranslation;

  @JsonProperty("collegeCode")
  private String collegeCode;

  @JsonProperty("objCode")
  private String objCode;

  @JsonProperty("courseCount")
  private int courseCount;

  @JsonProperty("units")
  private int units;

  @JsonProperty("inactive")
  private boolean inactive;
}
