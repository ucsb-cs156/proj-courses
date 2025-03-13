package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CourseInfo;
import edu.ucsb.cs156.courses.documents.GeneralEducation;
import edu.ucsb.cs156.courses.documents.Instructor;
import edu.ucsb.cs156.courses.documents.Section;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

public class CoursesCSVControllerTests {

  @Mock
  private ConvertedSectionCollection convertedSectionCollection =
      mock(ConvertedSectionCollection.class);

  @InjectMocks private CoursesCSVController coursesCSVController;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testCsvForQuarter_success() throws Exception {
    String yyyyq = "20252";

    CourseInfo info =
        CourseInfo.builder()
            .quarter(yyyyq)
            .courseId("CMPSC    8 -1")
            .title("INTRO TO COMP SCI")
            .generalEducation(
                List.of(
                    GeneralEducation.builder().geCode("C").build(),
                    GeneralEducation.builder().geCode("QNT").build()))
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

    when(convertedSectionCollection.findByQuarter(yyyyq)).thenReturn(dataPoints);

    ResponseEntity<StreamingResponseBody> response = coursesCSVController.csvForCourses(yyyyq, "");

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("text/csv;charset=UTF-8", response.getHeaders().getContentType().toString());
    String expectedFilename = "courses_" + yyyyq + ".csv";
    String expectedContentDisposition = "attachment;filename=" + expectedFilename;
    String actualContentDisposition =
        response.getHeaders().get(HttpHeaders.CONTENT_DISPOSITION).get(0);
    assertEquals(expectedContentDisposition, actualContentDisposition);

    StreamingResponseBody body = response.getBody();
    assertNotNull(body);

    OutputStream outputStream = new ByteArrayOutputStream();
    body.writeTo(outputStream);
    String csvOutput = outputStream.toString();

    String expectedCSVOutput =
        """
        "COURSEID","ENROLLED","GES","INSTRUCTOR","MAXENROLL","QUARTER","SECTION","STATUS"
        "CMPSC    8 -1","55","C, QNT","MIRZA D","150","20252","0100",""
        "CMPSC    8 -1","30","C, QNT","MIRZA D","30","20252","0101",""
        "CMPSC    8 -1","25","C, QNT","MIRZA D","30","20252","0102","Closed"
        "CMPSC    8 -1","0","C, QNT","MIRZA D","30","20252","0103","Closed"
        "CMPSC    8 -1","0","C, QNT","MIRZA D","30","20252","0104",""
        """;

    assertEquals(expectedCSVOutput, csvOutput);
  }
}
