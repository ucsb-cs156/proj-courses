package edu.ucsb.cs156.courses.entities;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class GradeHistoryTests {
    @Test
    public void test_getSubjectArea_and_getCourseNum_CMPSC_130A() throws Exception {
        GradeHistory gh = GradeHistory.builder()
            .course("CMPSC   130A")
            .build();
        assertEquals("CMPSC", gh.getSubjectArea());
        assertEquals("130A", gh.getCourseNum());
    }

    @Test
    public void test_getSubjectArea_and_getCourseNum_null() throws Exception {
        GradeHistory gh = GradeHistory.builder()
            .course(null)
            .build();
        assertNull(gh.getSubjectArea());
        assertNull(gh.getCourseNum());
    } 
}