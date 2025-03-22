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
public class CourseInfoTests {

  @Autowired ObjectMapper mapper;

  @Test
  public void test_clone() throws JsonProcessingException, CloneNotSupportedException {
    List<ConvertedSection> cs =
        mapper.readValue(
            CoursePageFixtures.CONVERTED_SECTIONS_JSON_MATH3B,
            new TypeReference<List<ConvertedSection>>() {});
    CourseInfo c1 = cs.get(0).getCourseInfo();
    CourseInfo c2 = (CourseInfo) c1.clone();
    assertEquals(c1, c2);
  }

  @Test
  public void test_null_ges() {
    CourseInfo c = CourseInfo.builder().generalEducation(null).build();
    assertEquals("", c.ges());
  }

  @Test
  public void test_empty_ges() {
    CourseInfo c = CourseInfo.builder().generalEducation(List.of()).build();
    assertEquals("", c.ges());
  }

  @Test
  public void test_ges_with_college() {

    List<GeneralEducation> ges =
        List.of(
            GeneralEducation.builder().geCode("C").geCollege("L&S").build(),
            GeneralEducation.builder().geCode("QNT").geCollege("L&S").build());

    CourseInfo c = CourseInfo.builder().generalEducation(ges).build();
    assertEquals("C (L&S), QNT (L&S)", c.ges());
  }

  @Test
  public void test_ges_with_nulls() {
    List<GeneralEducation> gesNullCases =
        List.of(GeneralEducation.builder().geCode("C").build(), GeneralEducation.builder().build());

    CourseInfo c = CourseInfo.builder().generalEducation(gesNullCases).build();
    assertEquals("C, ", c.ges());
  }
}
