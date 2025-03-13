package edu.ucsb.cs156.courses.documents;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@Import(ObjectMapper.class)
@ContextConfiguration
public class SectionTests {

  @Autowired ObjectMapper mapper;

  @Test
  public void test_clone() throws JsonProcessingException, CloneNotSupportedException {
    List<ConvertedSection> cs =
        mapper.readValue(
            CoursePageFixtures.CONVERTED_SECTIONS_JSON_MATH3B,
            new TypeReference<List<ConvertedSection>>() {});
    Section s1 = cs.get(0).getSection();
    Section s2 = (Section) s1.clone();
    assertEquals(s1, s2);
  }

  @Test
  public void test_status() {
    Section s = new Section();
    s.setCourseCancelled("Y");
    assertEquals("Cancelled", s.status());

    s.setCourseCancelled("");
    s.setClassClosed("Y");
    assertEquals("Closed", s.status());

    s.setCourseCancelled("");
    s.setClassClosed("");
    assertEquals("", s.status());

    s.setCourseCancelled(null);
    s.setClassClosed(null);
    assertEquals("", s.status());
  }

  @Test
  public void test_instructorlist() {

    Section s = new Section();
    assertEquals("", s.instructorList());
    List<Instructor> instructors =
        List.of(
            Instructor.builder().instructor("CONRAD P T").build(),
            Instructor.builder().instructor("WANG R K").build());
    s.setInstructors(instructors);
    assertEquals("CONRAD P T, WANG R K", s.instructorList());
  }
}
