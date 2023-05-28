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

import io.swagger.annotations.ApiParam;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/public/courseovertime")
public class CourseOverTimeBuildingController {

    private final Logger logger = LoggerFactory.getLogger(CourseOverTimeBuildingController.class);

    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    ConvertedSectionCollection convertedSectionCollection;

    @ApiOperation(value = "Get a list of courses over time, filtered by (abbreviated) building code")
    @GetMapping(value = "/buildingsearch", produces = "application/json")
    public ResponseEntity<String> search(
        @ApiParam(
            name =  "startQtr",
            type = "String",
            value = "Starting quarter in yyyyq format, e.g. 20231 for W23, 20232 for S23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
            example = "20231",
            required = true)
        @RequestParam String startQtr,
        @ApiParam(
            name =  "endQtr",
            type = "String",
            value = "Ending quarter in yyyyq format, e.g. 20231 for W23, 20232 for S23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
            example = "20231",
            required = true)
        @RequestParam String endQtr,
        @ApiParam(
            name =  "buildingCode",
            type = "String",
            value = "Building code such as PHELP for Phelps, GIRV for Girvetz",
            example = "GIRV",
            required = true)
        @RequestParam String buildingCode
    ) throws JsonProcessingException {
        List<ConvertedSection> courseResults = convertedSectionCollection.findByQuarterRangeAndBuildingCode(
            startQtr,
            endQtr,
            buildingCode
        );
        String body = mapper.writeValueAsString(courseResults);
        return ResponseEntity.ok().body(body);
    }    
}