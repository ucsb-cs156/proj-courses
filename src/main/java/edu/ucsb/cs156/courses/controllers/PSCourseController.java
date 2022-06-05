package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.entities.PSCourse;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.errors.EntityNotFoundException;
import edu.ucsb.cs156.courses.models.CurrentUser;
import edu.ucsb.cs156.courses.repositories.PSCourseRepository;
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

import javax.validation.Valid;
import java.util.Optional;

import edu.ucsb.cs156.courses.entities.PersonalSchedule;
import edu.ucsb.cs156.courses.repositories.PersonalScheduleRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.errors.BadEnrollCdException;

@Api(description = "PSCourse")
@RequestMapping("/api/courses")
@RestController
@Slf4j
public class PSCourseController extends ApiController {

    @Autowired
    PSCourseRepository coursesRepository;
    @Autowired
    PersonalScheduleRepository personalScheduleRepository;
    @Autowired
    UCSBCurriculumService ucsbCurriculumService;

    @ApiOperation(value = "List all courses (admin)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/all")
    public Iterable<PSCourse> allUsersCourses() {
        Iterable<PSCourse> courses = coursesRepository.findAll();
        return courses;
    }

    @ApiOperation(value = "List all courses (user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/user/all")
    public Iterable<PSCourse> thisUsersCourses() {
        CurrentUser currentUser = getCurrentUser();
        Iterable<PSCourse> courses = coursesRepository.findAllByUserId(currentUser.getUser().getId());
        return courses;
    }

    @ApiOperation(value = "List all courses for a specified psId (admin)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/psid/all")
    public Iterable<PSCourse> allCoursesForPsId(
            @ApiParam("psId") @RequestParam Long psId) {
        Iterable<PSCourse> courses = coursesRepository.findAllByPsId(psId);
        return courses;
    }

    @ApiOperation(value = "List all courses for a specified psId (user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/user/psid/all")
    public Iterable<PSCourse> thisUsersCoursesForPsId(
            @ApiParam("psId") @RequestParam Long psId) {
        User currentUser = getCurrentUser().getUser();
        Iterable<PSCourse> courses = coursesRepository.findAllByPsIdAndUser(psId, currentUser);
        return courses;
    }

    @ApiOperation(value = "Get a single course (admin)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public PSCourse getCourseById_admin(
            @ApiParam("id") @RequestParam Long id) {
        PSCourse courses = coursesRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

        return courses;
    }

    @ApiOperation(value = "Get a single course (user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/user")
    public PSCourse getCourseById(
            @ApiParam("id") @RequestParam Long id) {
        User currentUser = getCurrentUser().getUser();
        PSCourse courses = coursesRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

        return courses;
    }


    @ApiOperation(value = "Create a new course")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/post")
    public PSCourse postCourses(
            @ApiParam("enrollCd") @RequestParam String enrollCd,
            @ApiParam("psId") @RequestParam Long psId) {
        CurrentUser currentUser = getCurrentUser();
        log.info("currentUser={}", currentUser);

        PersonalSchedule checkPsId = personalScheduleRepository.findByIdAndUser(psId, currentUser.getUser())
        .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, psId));

        String body = ucsbCurriculumService.getSection(enrollCd, checkPsId.getQuarter());
        if(body.equals("{\"error\": \"401: Unauthorized\"}") || body.equals("{\"error\": \"Enroll code doesn't exist in that quarter.\"}")){
            throw new BadEnrollCdException(enrollCd);
        }

        PSCourse courses = new PSCourse();
        courses.setUser(currentUser.getUser());
        courses.setEnrollCd(enrollCd);
        courses.setPsId(psId);
        PSCourse savedCourses = coursesRepository.save(courses);
        return savedCourses;
    }

    @ApiOperation(value = "Delete a course (admin)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin")
    public Object deleteCourses_Admin(
            @ApiParam("id") @RequestParam Long id) {
              PSCourse courses = coursesRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

          coursesRepository.delete(courses);

        return genericMessage("PSCourse with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Delete a course (user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("/user")
    public Object deleteCourses(
            @ApiParam("id") @RequestParam Long id) {
        User currentUser = getCurrentUser().getUser();
        PSCourse courses = coursesRepository.findByIdAndUser(id, currentUser)
          .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));
        coursesRepository.delete(courses);
        return genericMessage("PSCourse with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a single Course (admin)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin")
    public PSCourse putCourseById_admin(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid PSCourse incomingCourses) {
              PSCourse courses = coursesRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

          courses.setEnrollCd(incomingCourses.getEnrollCd());
          courses.setPsId(incomingCourses.getPsId());

        coursesRepository.save(courses);

        return courses;
    }

    @ApiOperation(value = "Update a single course (user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("/user")
    public PSCourse putCoursesById(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid PSCourse incomingCourses) {
        User currentUser = getCurrentUser().getUser();
        PSCourse courses = coursesRepository.findByIdAndUser(id, currentUser)
          .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

        courses.setEnrollCd(incomingCourses.getEnrollCd());
        courses.setPsId(incomingCourses.getPsId());

        coursesRepository.save(courses);

        return courses;
    }
}