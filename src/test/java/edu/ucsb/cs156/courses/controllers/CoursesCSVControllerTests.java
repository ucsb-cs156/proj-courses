package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CourseInfo;
import edu.ucsb.cs156.courses.documents.GeneralEducation;
import edu.ucsb.cs156.courses.documents.Instructor;
import edu.ucsb.cs156.courses.documents.Section;
import edu.ucsb.cs156.courses.models.SectionCSVLine;
import edu.ucsb.cs156.courses.services.SectionCSVLineService;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import java.util.List;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.mockito.Answers;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = {CoursesCSVController.class})
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class CoursesCSVControllerTests extends ControllerTestCase {

  @MockBean private ConvertedSectionCollection convertedSectionCollection;

  @MockBean(answer = Answers.CALLS_REAL_METHODS)
  SectionCSVLineService sectionCsvLineService;

  @Mock(answer = Answers.CALLS_REAL_METHODS)
  StatefulBeanToCsv<SectionCSVLine> csvWriter;

  @Test
  public void test_csv_exception() throws Exception {

    // arrange

    String yyyyq = "20252";

    doReturn(List.of()).when(convertedSectionCollection).findByQuarter(yyyyq);
    doReturn(csvWriter).when(sectionCsvLineService).getStatefulBeanToCSV(any());

    doThrow(new CsvDataTypeMismatchException()).when(csvWriter).write(anyList());

    // act

    MvcResult response =
        mockMvc
            .perform(get("/api/courses/csv/quarter?yyyyq=20252"))
            .andExpect(request().asyncStarted())
            .andDo(MvcResult::getAsyncResult)
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String actualResponse = response.getResponse().getContentAsString();
    String expectedMessage = "";
    assertEquals(expectedMessage, actualResponse);
  }

  @Test
  @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
  public void testCsvForQuarter_success() throws Exception {
    String yyyyq = "20252";

    CourseInfo info =
        CourseInfo.builder()
            .quarter(yyyyq)
            .courseId("CMPSC    8 -1")
            .title("INTRO TO COMP SCI")
            .generalEducation(
                List.of(
                    GeneralEducation.builder().geCode("C").geCollege("L&S").build(),
                    GeneralEducation.builder().geCode("QNT").geCollege("L&S").build()))
            .build();

    Section section0100 =
        Section.builder()
            .section("0100")
            .enrolledTotal(55)
            .maxEnroll(150)
            .courseCancelled("")
            .classClosed("")
            .instructors(List.of(Instructor.builder().instructor("MIRZA D").build()))
            .build();

    Section section0101 =
        Section.builder()
            .section("0101")
            .enrolledTotal(30)
            .maxEnroll(30)
            .courseCancelled("")
            .classClosed("")
            .instructors(List.of(Instructor.builder().instructor("MIRZA D").build()))
            .build();

    Section section0102 =
        Section.builder()
            .section("0102")
            .enrolledTotal(25)
            .maxEnroll(30)
            .courseCancelled("")
            .classClosed("Y")
            .instructors(List.of(Instructor.builder().instructor("MIRZA D").build()))
            .build();

    Section section0103 =
        Section.builder()
            .section("0103")
            .enrolledTotal(0)
            .maxEnroll(30)
            .courseCancelled("")
            .classClosed("Y")
            .instructors(List.of(Instructor.builder().instructor("MIRZA D").build()))
            .build();

    Section section0104 =
        Section.builder()
            .section("0104")
            .enrolledTotal(0)
            .maxEnroll(30)
            .courseCancelled("T")
            .classClosed("")
            .instructors(List.of(Instructor.builder().instructor("MIRZA D").build()))
            .build();

    Stream<Section> sections =
        Stream.of(section0100, section0101, section0102, section0103, section0104);
    List<ConvertedSection> dataPoints =
        sections
            .map(section -> ConvertedSection.builder().courseInfo(info).section(section).build())
            .toList();

    String expectedCSVOutput =
        """
                "COURSEID","ENROLLED","GES","INSTRUCTOR","MAXENROLL","QUARTER","SECTION","STATUS"
                "CMPSC    8 -1","55","C (L&S), QNT (L&S)","MIRZA D","150","20252","0100",""
                "CMPSC    8 -1","30","C (L&S), QNT (L&S)","MIRZA D","30","20252","0101",""
                "CMPSC    8 -1","25","C (L&S), QNT (L&S)","MIRZA D","30","20252","0102","Closed"
                "CMPSC    8 -1","0","C (L&S), QNT (L&S)","MIRZA D","30","20252","0103","Closed"
                "CMPSC    8 -1","0","C (L&S), QNT (L&S)","MIRZA D","30","20252","0104",""
                """;

    doReturn(dataPoints).when(convertedSectionCollection).findByQuarter(yyyyq);

    MvcResult response =
        mockMvc
            .perform(get("/api/courses/csv/quarter?yyyyq=20252"))
            .andExpect(request().asyncStarted())
            .andDo(MvcResult::getAsyncResult)
            .andExpect(status().isOk())
            .andReturn();

    verify(convertedSectionCollection, times(1)).findByQuarter(yyyyq);
    verify(sectionCsvLineService, times(1)).getStatefulBeanToCSV(any());

    assertEquals(expectedCSVOutput, response.getResponse().getContentAsString());
  }
}
