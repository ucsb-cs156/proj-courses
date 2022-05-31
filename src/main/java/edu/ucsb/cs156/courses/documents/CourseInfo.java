package edu.ucsb.cs156.courses.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CourseInfo is an object that stores all of the information about a
 * course from the UCSB Courses API except for the section info
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseInfo {
    private String quarter;
    private String courseId;
    private String title;
    private String description;
}