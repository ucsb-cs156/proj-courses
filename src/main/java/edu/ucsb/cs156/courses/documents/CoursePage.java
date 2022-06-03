package edu.ucsb.cs156.courses.documents;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class CoursePage {
    private int pageNumber;
    private int pageSize;
    private int total;
    private List<Course> classes;

    /**
     * Create a CoursePage object from json representation
     * 
     * @param json String of json returned by API endpoint {@code /classes/search}
     * @return a new CoursePage object
     * @see <a href=
     *      "https://developer.ucsb.edu/content/academic-curriculums">https://developer.ucsb.edu/content/academic-curriculums</a>
     */
    public static CoursePage fromJSON(String json) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            CoursePage coursePage = objectMapper.readValue(json, CoursePage.class);
            return coursePage;
        } catch (JsonProcessingException jpe) {
            log.error("JsonProcessingException:" + jpe);
            return null;
        }
    }

    /**
     * Create a List<ConvertedSection> from json representation
     * 
     * @param json String of json returned by API endpoint {@code /classes/search}
     * @return a new CoursePage object
     * @see <a href=
     *      "https://developer.ucsb.edu/content/academic-curriculums">https://developer.ucsb.edu/content/academic-curriculums</a>
     */
    public List<ConvertedSection> convertedSections() {

        List<ConvertedSection> result = new ArrayList<ConvertedSection>();

        for (Course c : this.getClasses()) {
            for (Section section : c.getClassSections()) {
                int lectureNum = Integer.parseInt(section.getSection()) / 100;
                CourseInfo courseInfo = CourseInfo.builder()
                        .quarter(c.getQuarter())
                        .courseId(c.getCourseId() + "-" + Integer.toString(lectureNum))
                        .title(c.getTitle())
                        .description(c.getDescription())
                        .build();
                ConvertedSection cs = ConvertedSection.builder()
                        .courseInfo(courseInfo)
                        .section(section)
                        .build();
                result.add(cs);

            }
        }
        return result;
    }

}