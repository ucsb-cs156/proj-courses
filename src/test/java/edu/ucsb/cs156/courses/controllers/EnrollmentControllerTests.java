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
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import edu.ucsb.cs156.courses.services.EnrollmentDataPointService;
import edu.ucsb.cs156.courses.testconfig.TestConfig;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Answers;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = {EnrollmentController.class})
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class EnrollmentControllerTests extends ControllerTestCase {

  @MockBean private EnrollmentDataPointRepository enrollmentDataPointRepository;

  @MockBean(answer = Answers.CALLS_REAL_METHODS)
  EnrollmentDataPointService enrollmentDataPointService;

  @Mock(answer = Answers.CALLS_REAL_METHODS)
  StatefulBeanToCsv<EnrollmentDataPoint> csvWriter;

  @Test
  public void test_csv_exception() throws Exception {

    // arrange

    String yyyyq = "20252";

    doReturn(List.of()).when(enrollmentDataPointRepository).findByYyyyq(yyyyq);
    doReturn(csvWriter).when(enrollmentDataPointService).getStatefulBeanToCSV(any());

    doThrow(new CsvDataTypeMismatchException()).when(csvWriter).write(anyList());

    // act

    MvcResult response =
        mockMvc
            .perform(get("/api/enrollment/csv/quarter?yyyyq=20252"))
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

    EnrollmentDataPoint dataPoint =
        EnrollmentDataPoint.builder()
            .id(1L)
            .yyyyq(yyyyq)
            .courseId("CMPSC 156")
            .dateCreated(LocalDateTime.parse("2022-03-05T15:50:10"))
            .enrollment(96)
            .enrollCd("12345")
            .section("0100")
            .build();

    List<EnrollmentDataPoint> dataPoints = List.of(dataPoint);

    String expectedCSVOutput =
        """
                "COURSEID","DATECREATED","ENROLLCD","ENROLLMENT","ID","SECTION","YYYYQ"
                "CMPSC 156","2022-03-05T15:50:10","12345","96","1","0100","20252"
                """;

    doReturn(dataPoints).when(enrollmentDataPointRepository).findByYyyyq(yyyyq);

    MvcResult response =
        mockMvc
            .perform(get("/api/enrollment/csv/quarter?yyyyq=20252"))
            .andExpect(request().asyncStarted())
            .andDo(MvcResult::getAsyncResult)
            .andExpect(status().isOk())
            .andReturn();

    verify(enrollmentDataPointRepository, times(1)).findByYyyyq(yyyyq);
    verify(enrollmentDataPointService, times(1)).getStatefulBeanToCSV(any());

    assertEquals(expectedCSVOutput, response.getResponse().getContentAsString());
  }
}
