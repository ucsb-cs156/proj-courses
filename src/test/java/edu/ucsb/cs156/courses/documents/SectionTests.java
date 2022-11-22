package edu.ucsb.cs156.courses.documents;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
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
public class SectionTests {

    @Autowired
    ObjectMapper mapper;

    @Test
    public void test_clone() throws JsonProcessingException, CloneNotSupportedException {
       List<ConvertedSection> cs = mapper.readValue(CoursePageFixtures.CONVERTED_SECTIONS_JSON_MATH5B, 
       new TypeReference<List<ConvertedSection>>() {});
       Section s1 = cs.get(0).getSection();
       Section s2 = (Section) s1.clone();
       assertEquals(s1, s2);
    }

}
