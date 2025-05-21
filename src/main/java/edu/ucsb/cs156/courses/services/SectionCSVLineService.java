package edu.ucsb.cs156.courses.services;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import edu.ucsb.cs156.courses.models.SectionCSVLine;
import java.io.IOException;
import java.io.Writer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service("sectionCSVLineService")
@Slf4j
public class SectionCSVLineService {
  public StatefulBeanToCsv<SectionCSVLine> getStatefulBeanToCSV(Writer writer) throws IOException {
    return new StatefulBeanToCsvBuilder<SectionCSVLine>(writer).build();
  }
}
