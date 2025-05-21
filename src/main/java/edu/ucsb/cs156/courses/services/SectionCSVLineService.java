package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.models.SectionCSVLine;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import org.springframework.stereotype.Service;


@Service("sectionCSVLineService")
@Slf4j
public class SectionCSVLineService {
  public StatefulBeanToCsv<SectionCSVLine> getStatefulBeanToCSV(Writer writer) throws IOException {
    return new StatefulBeanToCsvBuilder<SectionCSVLine>(writer).build();
  }
}
