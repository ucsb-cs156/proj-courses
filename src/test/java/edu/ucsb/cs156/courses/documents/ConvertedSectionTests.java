package edu.ucsb.cs156.courses.documents;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
    assertEquals("20211", edp.getYyyyq());
    assertEquals("10001", edp.getEnrollCd());
    assertEquals(10, edp.getEnrollment());
  }
}
