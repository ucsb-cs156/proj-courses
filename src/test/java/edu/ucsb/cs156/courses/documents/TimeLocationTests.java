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
public class TimeLocationTests {

    @Autowired
    ObjectMapper mapper;

    @Test
    public void test_clone() throws JsonProcessingException, CloneNotSupportedException {
        TimeLocation tl1 = TimeLocation.builder()
                .room("123")
                .building("Bren Hall")
                .roomCapacity("16")
                .days("MWF")
                .beginTime("10:00")
                .endTime("11:00")
                .build();

        TimeLocation tl2 = (TimeLocation) tl1.clone();
        assertEquals(tl1, tl2);
    }
}
