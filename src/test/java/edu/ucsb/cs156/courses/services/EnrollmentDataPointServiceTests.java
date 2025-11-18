package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.*;

import com.opencsv.bean.StatefulBeanToCsv;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.io.StringWriter;
import org.junit.jupiter.api.Test;

public class EnrollmentDataPointServiceTests {

  @Test
  public void test_getStatefulBeanToCSV_successful() throws Exception {
    // Instantiate the class
    EnrollmentDataPointService enrollmentDataPointService = new EnrollmentDataPointService();

    // Call the method
    StringWriter writer = new StringWriter();
    StatefulBeanToCsv<EnrollmentDataPoint> csvWriter =
        enrollmentDataPointService.getStatefulBeanToCSV(writer);

    // Assert it returns a usable object
    assertNotNull(csvWriter);
  }
}
