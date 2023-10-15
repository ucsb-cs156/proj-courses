package edu.ucsb.cs156.courses.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


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
