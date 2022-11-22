package edu.ucsb.cs156.courses.collections;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import edu.ucsb.cs156.courses.documents.ConvertedSection;

@Repository
public interface ConvertedSectionCollection extends MongoRepository<ConvertedSection, ObjectId> {
    /**
     * Returns a {@link ConvertedSection} identified by that quarter it is offered and its 13 character course id.
     * <br>
     * Note: the courseId must be a properly padded 13 character course id. If you have the course's subject code
     * (e.g. CMPSC) and course number (e.g. 190J), use the overloaded version of this method instead.
     * {@link #findByQuarterAndCourseId(String, String, String)}
     *
     * @param quarter  the quarter that the course is offered
     * @param courseId the course's 13 character course id
     * @return a List of {@link ConvertedSection}, if a matching course was found
     * @see #findByQuarterAndCourseId(String, String, String)
     */
    List<ConvertedSection> findByQuarterAndCourseId(String quarter, String courseId);

    /**
     * Returns a {@link ConvertedSection} identified by the quarter that it is offered, its subject code, and its course
     * number.
     * <br>
     * This is a convenience method that calls {@link #findByQuarterAndCourseId(String, String)} with a properly
     * padded course id.
     *
     * @param quarter      the quarter that the course is offered
     * @param subjectCode  the course's subject code
     * @param courseNumber the course's course number
     * @return a List of {@link ConvertedSection}, if a matching course was found
     * @see #findByQuarterAndCourseId(String, String)
     */
    default List<ConvertedSection> findByQuarterAndCourseId(String quarter,
                                                                 String subjectCode,
                                                                 String courseNumber) {
        return findByQuarterAndCourseId(quarter, String.format("%-8s%-5s", subjectCode, courseNumber));
    }

}
