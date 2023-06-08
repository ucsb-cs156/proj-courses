package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.entities.GradeHistory;

import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;
import edu.ucsb.cs156.courses.services.UCSBGradeHistoryService;
import edu.ucsb.cs156.courses.services.UCSBGradeHistoryServiceImpl;
import edu.ucsb.cs156.courses.utilities.CourseUtilities;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;

@Slf4j
@Api(description = "API for grade history data")
@RequestMapping("/api/gradehistory")
@RestController
public class GradeHistoryController extends ApiController {
    @Autowired
    GradeHistoryRepository gradeHistoryRepository;

    @Autowired
    ObjectMapper mapper;

    @ApiOperation(value = "Get grade history for a course")
    @GetMapping(value = "/search", produces = "application/json")
    public Iterable<GradeHistory> gradeHistoryBySubjectAreaAndCourseNumber(
        @ApiParam(
            name =  "subjectArea",
            type = "String",
            value = "Subjects of UCSB",
            example = "CMPSC",
            required = true)
        @RequestParam String subjectArea,
        @ApiParam(
            name =  "courseNumber",
            type = "String",
            value = "Represents a subject-specific course",
            example = "130A",
            required = true)
        @RequestParam String courseNumber
      )  
      {
      String course=CourseUtilities.makeFormattedCourseId(subjectArea, courseNumber);
      Iterable<GradeHistory> gradeHistoryRows = gradeHistoryRepository.findByCourse(course);
      return gradeHistoryRows;
    }

}