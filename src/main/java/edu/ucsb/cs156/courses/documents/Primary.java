package edu.ucsb.cs156.courses.documents;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.mapping.Document;

@Slf4j
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "primaries")
public class Primary {
  private String quarter;
  private String courseId;
  private String title;
  private String description;
  private Section primary;
  private List<Section> secondaries;
  private List<GeneralEducation> generalEducation;
}
