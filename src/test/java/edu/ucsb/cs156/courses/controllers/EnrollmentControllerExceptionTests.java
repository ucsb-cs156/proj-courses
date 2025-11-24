package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import edu.ucsb.cs156.courses.repositories.EnrollmentDataPointRepository;
import edu.ucsb.cs156.courses.services.EnrollmentDataPointCSVService;
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
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = {EnrollmentController.class})
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class EnrollmentControllerExceptionTests extends ControllerTestCase {

  @MockBean EnrollmentDataPointRepository enrollmentDataPointRepository;

  @MockBean(answer = Answers.CALLS_REAL_METHODS)
  EnrollmentDataPointCSVService enrollmentDataPointCSVService;

  @Mock(answer = Answers.CALLS_REAL_METHODS)
  StatefulBeanToCsv<EnrollmentDataPoint> csvWriter;

  @Test
  public void test_exception() throws Exception {

    // arrange

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

    when(enrollmentDataPointRepository.findByYyyyq(yyyyq)).thenReturn(dataPoints);
    doReturn(csvWriter).when(enrollmentDataPointCSVService).getStatefulBeanToCSV(any());

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
}
