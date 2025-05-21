package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.*;
import com.opencsv.bean.StatefulBeanToCsv;
import org.junit.jupiter.api.Test;

import java.io.StringWriter;

import edu.ucsb.cs156.courses.models.SectionCSVLine;


public class SectionCSVLineServiceTests {

    @Test
    public void test_getStatefulBeanToCSV_successful() throws Exception {
        // Instantiate the class 
        SectionCSVLineService sectionCsvLineService = new SectionCSVLineService();

        // Call the method 
        StringWriter writer = new StringWriter();
        StatefulBeanToCsv<SectionCSVLine> csvWriter = sectionCsvLineService.getStatefulBeanToCSV(writer);

        // Assert it returns a usable object
        assertNotNull(csvWriter);
    }
}

