package edu.ucsb.cs156.courses.documents;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.util.List;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@Import(ObjectMapper.class)
@ContextConfiguration
public class ConvertedSectionTests {

  @Autowired ObjectMapper mapper;

  @Test
  public void test_clone() throws JsonProcessingException, CloneNotSupportedException {
    List<ConvertedSection> cs =
        mapper.readValue(
            CoursePageFixtures.CONVERTED_SECTIONS_JSON_MATH3B,
            new TypeReference<List<ConvertedSection>>() {});

    ConvertedSection cs1 = cs.get(0);
    cs1.set_id(new ObjectId());
    ConvertedSection cs2 = (ConvertedSection) cs1.clone();
    assertEquals(cs1, cs2);
  }

  @Test
  public void test_EnrollmentDataPoint() throws JsonProcessingException {
    List<ConvertedSection> cs =
        mapper.readValue(
            CoursePageFixtures.CONVERTED_SECTIONS_JSON_MATH3B,
            new TypeReference<List<ConvertedSection>>() {});

    ConvertedSection cs1 = cs.get(0);
    EnrollmentDataPoint edp = cs1.getEnrollmentDataPoint();
    assertEquals("20222", edp.getYyyyq());
    assertEquals("30395", edp.getEnrollCd());
    assertEquals("MATH      3B -1", edp.getCourseId());
    assertEquals("0100", edp.getSection());
    assertEquals(142, edp.getEnrollment());
  }

  @Test
  public void test_ConvertedSectionSortDescendingByQuarterComparator()
      throws JsonProcessingException {
    List<ConvertedSection> cs =
        mapper.readValue(
            CoursePageFixtures.CONVERTED_SECTIONS_JSON_MATH3B,
            new TypeReference<List<ConvertedSection>>() {});
    ConvertedSection cs1 = cs.get(0);
    ConvertedSection cs2 = cs.get(1);
    ConvertedSection.ConvertedSectionSortDescendingByQuarterComparator comparator =
        new ConvertedSection.ConvertedSectionSortDescendingByQuarterComparator();
    int result = comparator.compare(cs1, cs2);
    assertEquals(0, result); // Both sections have the same quarter "20222"

    cs1.getCourseInfo().setQuarter("20201");
    result = comparator.compare(cs1, cs2);
    assertTrue(result > 0); // cs1 is earlier than cs2 (sorting descending)

    cs1.getCourseInfo().setQuarter("20242");
    result = comparator.compare(cs1, cs2);
    assertTrue(result < 0); // cs1 is later than cs2 (sorting descending)
  }
}
