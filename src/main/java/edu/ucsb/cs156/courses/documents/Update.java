package edu.ucsb.cs156.courses.documents;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "updates")
public class Update {
  private ObjectId _id;
  private String subject_area;
  private String quarter_yyyyq;
  private LocalDateTime last_update;
}
