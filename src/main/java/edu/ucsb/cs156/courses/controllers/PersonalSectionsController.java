package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.entities.PersonalSchedule;
import edu.ucsb.cs156.courses.entities.PSCourse;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.errors.EntityNotFoundException;
import edu.ucsb.cs156.courses.models.CurrentUser;
import edu.ucsb.cs156.courses.repositories.PersonalScheduleRepository;
import edu.ucsb.cs156.courses.repositories.PSCourseRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.documents.Course;
import edu.ucsb.cs156.courses.documents.CourseInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;


import javax.validation.Valid;
import java.util.Optional;

@Api(description = "Personal Sections")
@RequestMapping("/api/personalSections")
@RestController
@Slf4j
public class PersonalSectionsController extends ApiController {
    @Autowired
    PersonalScheduleRepository personalScheduleRepository;

    @Autowired
    PSCourseRepository coursesRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    UCSBCurriculumService ucsbCurriculumService;

    @ApiOperation(value = "List all sections given a psId")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping(value = "/all", produces = "application/json")
    public ArrayList<Course> getSectionsByPsId(@ApiParam("psId") @RequestParam Long psId) throws JsonProcessingException{
        User us = getCurrentUser().getUser();
        PersonalSchedule ps = personalScheduleRepository.findByIdAndUser(psId,us)
                .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, psId));
        ArrayList<Course> sections = new ArrayList<Course>();
        ArrayList<String> jsons = new ArrayList<String>();
        Iterable<PSCourse> courses = coursesRepository.findAllByPsId(psId);
        for (PSCourse crs:courses) {

                User u = crs.getUser();
                String qtr = ps.getQuarter();
                String responseBody = ucsbCurriculumService.getJSONbyQtrEnrollCd(qtr, crs.getEnrollCd());
                jsons.add(responseBody);
                Course course = objectMapper.readValue(responseBody, Course.class);
                sections.add(course);

        }
        return sections;
    }

}
