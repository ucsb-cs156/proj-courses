package edu.ucsb.cs156.courses.models.github;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TreeElement {
  private String path;
  private String mode;
  private String type;
  private String sha;
  private int size;
  private String url;
}
