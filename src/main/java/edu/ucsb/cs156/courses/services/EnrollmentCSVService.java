package edu.ucsb.cs156.courses.services;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import edu.ucsb.cs156.courses.models.EnrollmentCSV;  // <-- adjust to your actual model
import java.io.IOException;
import java.io.Writer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service("enrollmentCSVService")
@Slf4j
public class EnrollmentCSVService {
  public StatefulBeanToCsv<EnrollmentCSV> getStatefulBeanToCSV(Writer writer) throws IOException {
    if (writer == null) {
        throw new RuntimeException("writer cannot be null");
    }
    return new StatefulBeanToCsvBuilder<EnrollmentCSV>(writer).build();
  }
}
