package edu.ucsb.cs156.courses.documents;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

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
public class InstructorTests {

    @Autowired
    ObjectMapper mapper;

    @Test
    public void test_clone() throws JsonProcessingException, CloneNotSupportedException {
        Instructor i1  = Instructor.builder()
            .instructor("John Doe")
            .functionCode("P")
            .build();

        Instructor i2 = (Instructor) i1.clone();
        assertEquals(i1, i2);
    }

    @Test
    public void test_noArgsConstructor()  {
        Instructor i1  = new Instructor();
        assertNull(i1.getInstructor());
        assertNull(i1.getFunctionCode());
    }
}
