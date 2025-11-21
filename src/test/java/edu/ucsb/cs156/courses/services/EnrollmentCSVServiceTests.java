package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.*;

import com.opencsv.bean.StatefulBeanToCsv;
import edu.ucsb.cs156.courses.models.EnrollmentCSV;
import org.junit.jupiter.api.Test;

import java.io.StringWriter;
import java.io.Writer;
import java.time.LocalDateTime;
import java.util.List;

public class EnrollmentCSVServiceTests {

    @Test
    public void testGetStatefulBeanToCsv_success() throws Exception {
        Writer writer = new StringWriter();
        EnrollmentCSVService service = new EnrollmentCSVService();

        StatefulBeanToCsv<EnrollmentCSV> bean = service.getStatefulBeanToCSV(writer);

        assertNotNull(bean, "Bean should not be null");
    }

    @Test
    public void testCsvWriting_validData() throws Exception {
        Writer writer = new StringWriter();
        EnrollmentCSVService service = new EnrollmentCSVService();

        StatefulBeanToCsv<EnrollmentCSV> bean = service.getStatefulBeanToCSV(writer);

        EnrollmentCSV row = EnrollmentCSV.builder()
                .id(1L)
                .yyyyq("20252")
                .courseId("CMPSC 156")
                .section("0100")
                .enrollCd("12345")
                .enrollment(96)
                .dateCreated(LocalDateTime.now())
                .build();

        // Write CSV
        bean.write(List.of(row));

        String csvOutput = writer.toString();
        assertTrue(csvOutput.contains("CMPSC 156"), "CSV output should contain courseId");
        assertTrue(csvOutput.contains("20252"), "CSV output should contain quarter");
    }

    @Test
    public void testGetStatefulBeanToCsv_nullWriterThrows() {
        EnrollmentCSVService service = new EnrollmentCSVService();

        Exception exception = assertThrows(RuntimeException.class, () -> {
            service.getStatefulBeanToCSV(null);
        });

        assertTrue(exception.getMessage().toLowerCase().contains("writer cannot be null"));
    }
}
