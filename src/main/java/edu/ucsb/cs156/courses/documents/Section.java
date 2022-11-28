package edu.ucsb.cs156.courses.documents;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Section implements Cloneable {

    /** a unique number assigned to a section */
    private String enrollCode;
    /** section number of the course */
    private String section;
    /** session only for summer quarter */
    private String session;
    /** if the class is closed */
    private String classClosed;
    /** is course cancelled */
    private String courseCancelled;
    /**
     * Grading Options Code like Pass/No Pass (P/NP) Or Letter Grades (L).
     * 
     * @see <a href=
     *      "https://developer.ucsb.edu/content/student-record-code-lookups">
     *      https://developer.ucsb.edu/content/student-record-code-lookups</a>
     * 
     */
    private String gradingOptionCode;

    /** total number of enrollments in the course */
    private Integer enrolledTotal;
    /** max number of students can be enrolled in the section */
    private Integer maxEnroll;

    /** Secondary Status of the course */
    private String secondaryStatus;

    /** Is department approval required for enrollment in the section */
    private boolean departmentApprovalRequired;

    /** Is instructor approval required for enrollment in the section */
    private boolean instructorApprovalRequired;

    /** Is there restriction on the level of the course */
    private String restrictionLevel;

    /** Is there restriction on the major of the student */
    private String restrictionMajor;

    /** Is there restriction on the major and pass time of the student */
    private String restrictionMajorPass;

    /** Is there restriction on the minor of the student */
    private String restrictionMinor;

    /** Is there restriction on the minor and pass time of the student */
    private String restrictionMinorPass;

    /** Concurrent courses for the section */
    private List<String> concurrentCourses;

    /**
     * List of {@link TimeLocation} objects for this course
     */
    private List<TimeLocation> timeLocations;
    /**
     * List of {@link Instructor} objects for this course
     */
    private List<Instructor> instructors;

    public Object clone() throws CloneNotSupportedException {

        Section newSection = (Section) super.clone();
        // List<String> copyConcurrentCourses = new ArrayList<>();
        // Collections.copy(copyConcurrentCourses, this.getConcurrentCourses());
        // newSection.setConcurrentCourses(copyConcurrentCourses);

        // List<TimeLocation> copyTimeLocations = new ArrayList<>();
        // for (TimeLocation tl : this.getTimeLocations()) {
        //     copyTimeLocations.add((TimeLocation) tl.clone());
        // }
        // newSection.setTimeLocations(copyTimeLocations);

        // List<Instructor> copyInstructors = new ArrayList<>();
        // for (Instructor i : this.getInstructors()) {
        //     copyInstructors.add((Instructor) i.clone());
        // }
        // newSection.setInstructors(copyInstructors);

        return newSection;
    }
}