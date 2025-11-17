package edu.ucsb.cs156.courses.services;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import edu.ucsb.cs156.courses.entities.EnrollmentDataPoint;
import java.io.Writer;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentCSVService {

    public StatefulBeanToCsv<EnrollmentDataPoint> getStatefulBeanToCSV(Writer writer) {
        return new StatefulBeanToCsvBuilder<EnrollmentDataPoint>(writer).build();
    }

    public void writeEnrollmentCSV(Writer writer, List<EnrollmentDataPoint> list)
            throws CsvDataTypeMismatchException, CsvRequiredFieldEmptyException {

        StatefulBeanToCsv<EnrollmentDataPoint> beanToCsvWriter = getStatefulBeanToCSV(writer);
        beanToCsvWriter.write(list);
    }
}
