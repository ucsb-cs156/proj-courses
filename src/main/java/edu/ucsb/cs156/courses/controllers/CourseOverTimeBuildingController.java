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
public class CourseOverTimeBuildingController {

    private final Logger logger = LoggerFactory.getLogger(CourseOverTimeBuildingController.class);

    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    ConvertedSectionCollection convertedSectionCollection;

    @ApiOperation(value = "Get a list of courses over time, filtered by (abbreviated) building name")
    @GetMapping(value = "/buildingsearch", produces = "application/json")
    public ResponseEntity<String> search(
        @RequestParam String startQtr,
        @RequestParam String endQtr,
        @RequestParam String buildingName
    ) throws JsonProcessingException {
        List<ConvertedSection> courseResults = convertedSectionCollection.findByQuarterRangeAndBuildingName(
            startQtr,
            endQtr,
            buildingName
        );
        String body = mapper.writeValueAsString(courseResults);
        return ResponseEntity.ok().body(body);
    }    
}