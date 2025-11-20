package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.opencsv.bean.StatefulBeanToCsv;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.io.StringWriter;
import org.junit.jupiter.api.Test;

public class EnrollmentDataPointCSVServiceTests {

  @Test
  public void test_getStatefulBeanToCSV_successful() throws Exception {
    // Instantiate the class
    EnrollmentDataPointCSVService enrollmentDataPointCSVService =
        new EnrollmentDataPointCSVService();

    // Call the method
    StringWriter writer = new StringWriter();
    StatefulBeanToCsv<EnrollmentDataPoint> csvWriter =
        enrollmentDataPointCSVService.getStatefulBeanToCSV(writer);

    // Assert it returns a usable object
    assertNotNull(csvWriter);
  }
}
