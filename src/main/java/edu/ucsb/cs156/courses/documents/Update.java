package edu.ucsb.cs156.courses.documents;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "updates")
public class Update {
  private ObjectId _id;
  private String subjectArea;
  private String quarter;
  private int saved;
  private int updated;
  private int errors;

  @LastModifiedDate private LocalDateTime lastUpdate;
}
