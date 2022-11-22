package edu.ucsb.cs156.courses.documents;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "courses")
public class ConvertedSection {
    private ObjectId _id;
    private CourseInfo courseInfo;
    private Section section;
}
