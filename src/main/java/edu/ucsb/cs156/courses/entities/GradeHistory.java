package edu.ucsb.cs156.courses.entities;

import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.persistence.GeneratedValue;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * GradeHistory - Entity for grade history data.  Each object represents one
 * row from the CSV files located in this repository:
 * <a href="https://github.com/rtora/UCSB_Grades">https://github.com/rtora/UCSB_Grades</a>
 * 
 * There is a unique constraint on the combination of year, 
 * quarter, subjectArea, course, instructor, and grade, since we do not want
 * duplicate rows of data for the same course.
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

@Entity(name = "historygrade")
@Table(uniqueConstraints = { @UniqueConstraint(name = "UniqueGradeHistory", columnNames = { "yyyyq", "course","instructor","grade","count"}) })

public class GradeHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String yyyyq;
    private String course;
    private String instructor;
    private String grade;
    private int count;

    public String getSubjectArea() {
        if (course==null)
            return null;
        return course.substring(0, 8).trim();
    }
    public String getCourseNum() {
        if (course==null)
            return null;
        return course.substring(8).trim();
    }

}