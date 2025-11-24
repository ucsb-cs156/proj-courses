package edu.ucsb.cs156.courses.services;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.io.IOException;
import java.io.Writer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service("enrollmentDataPointCSVService")
@Slf4j
public class EnrollmentDataPointCSVService {
  public StatefulBeanToCsv<EnrollmentDataPoint> getStatefulBeanToCSV(Writer writer)
      throws IOException {
    return new StatefulBeanToCsvBuilder<EnrollmentDataPoint>(writer).build();
  }
}
