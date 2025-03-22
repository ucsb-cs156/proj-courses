package edu.ucsb.cs156.courses.documents;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@Import(ObjectMapper.class)
@ContextConfiguration
public class GeneralEducationTests {

  @Autowired ObjectMapper mapper;

  @Test
  public void test_toString() {
    GeneralEducation ge = GeneralEducation.builder().geCode("C ").geCollege("L&S ").build();
    assertEquals("C (L&S)", ge.toString());
  }
}
