package edu.ucsb.cs156.courses.utilities;

/**
 * static utility methods for dealing with courses
 */
public class CourseUtilities {

    // Utility class; this allows jacoco to be satisified that constructors are covered.
    private CourseUtilities() {} 

    /**
     * Given a subject area and course number, return a course id that is formatted
     * in the precise way that course numbers are formatted in UCSB's GOLD system.
     * 
     * That format has the subject area left justified in an 8 character field,
     * followed by the course number right justified in a 3 character field,
     * followed
     * by the suffix (if any) left justified in a 2 character field.
     * 
     * Examples: (the <code>1234567812312</code> line is there to show the spacing.)
     * 
     * <pre>
     * 1234567812312
     * CMPSC   130A
     * CMPSC     5JA
     * CMPSC    24
     * </pre>
     * 
     * @param subjectArea  subject area, such as CMPSC
     * @param courseNumber course number, such as 130A
     * @return formatted course number
     */
    public static String makeFormattedCourseId(String subjectArea, String courseNumber) {
        String[] nums = courseNumber.split("[a-zA-Z]+");
        String[] suffs = courseNumber.split("[0-9]+");
        String result = "";
        if (suffs.length < 2) { // no suffix
            result = String.format("%-8s", subjectArea) // 'CMPSC '
                    + String.format("%3s", nums[0]) // ' 8'
            ;
        } else {
            result = String.format("%-8s", subjectArea) // 'CMPSC '
                    + String.format("%3s", nums[0]) // ' 8'
                    + String.format("%-2s", suffs[1]) // 'A '
            ;
        }
        return result.trim();
    }
}