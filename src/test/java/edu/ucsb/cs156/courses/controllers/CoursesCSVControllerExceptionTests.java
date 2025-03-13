package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = {CoursesCSVController.class})
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class CoursesCSVControllerExceptionTests extends ControllerTestCase {

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @Test
  public void test_exception() throws Exception {

    // arrange

    String yyyyq = "20252";

    List<ConvertedSection> emptyList = List.of();

    when(convertedSectionCollection.findByQuarter(yyyyq)).thenReturn(emptyList);

    // act

    MvcResult response =
        mockMvc
            .perform(
                get(
                    "/api/courses/csv/quarter?yyyyq=20252&testException=CsvDataTypeMismatchException"))
            .andReturn();

    // assert
    String actualResponse = response.getResponse().getContentAsString();
    assertEquals("", actualResponse);
  }
}
