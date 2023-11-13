package edu.ucsb.cs156.courses.models;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResult {
  private String sha;
  private String url;
  private List<TreeElement> tree;
  private Boolean truncated;
}
