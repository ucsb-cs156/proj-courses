package edu.ucsb.cs156.courses.controllers;

import java.util.List;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import io.swagger.annotations.ApiOperation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/public/courseovertime")
public class CourseOverTimeController {

    private final Logger logger = LoggerFactory.getLogger(CourseOverTimeController.class);

    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    ConvertedSectionCollection convertedSectionCollection;

    @ApiOperation(value = "Get a list of courses over time")
    @GetMapping(value = "/search", produces = "application/json")
    public ResponseEntity<String> search(
        @RequestParam String startQtr,
        @RequestParam String endQtr,
        @RequestParam String subjectArea,
        @RequestParam String courseNumber
    ) throws JsonProcessingException {
        List<ConvertedSection> courseResults = convertedSectionCollection.findByQuarterRangeAndCourseId(
            startQtr,
            endQtr,
            makeFormattedCourseId(subjectArea, courseNumber)
        );
        String body = mapper.writeValueAsString(courseResults);
        return ResponseEntity.ok().body(body);
    }

    String makeFormattedCourseId(String subjectArea, String courseNumber) {
        String[] nums = courseNumber.split("[a-zA-Z]+");
        String[] suffs = courseNumber.split("[0-9]+");
        if (suffs.length < 2) { // no suffix
            return
                  String.format( "%-8s", subjectArea                ) // 'CMPSC   '
                + String.format( "%3s" , nums[0]                    ) // '  8'
            ;
        }
        return
              String.format( "%-8s", subjectArea                ) // 'CMPSC   '
            + String.format( "%3s" , nums[0]                    ) // '  8'
            + String.format( "%-2s", suffs[1]                   ) // 'A '
        ;
    }
    
}
