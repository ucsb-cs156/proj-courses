package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.entities.Courses;
// import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.errors.EntityNotFoundException;
import edu.ucsb.cs156.courses.models.CurrentUser;
import edu.ucsb.cs156.courses.repositories.CoursesRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
// import io.swagger.annotations.ApiResponse;
import lombok.extern.slf4j.Slf4j;

// import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
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
// import java.util.Optional;

@Api(description = "Courses")
@RequestMapping("/api/courses")
@RestController
@Slf4j
public class CoursesController extends ApiController {

    @Autowired
    CoursesRepository coursesRepository;

    @ApiOperation(value = "List all courses")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/all")
    public Iterable<Courses> allUsersCourses() {
        Iterable<Courses> courses = coursesRepository.findAll();
        return courses;
    }

    @ApiOperation(value = "List this user's courses")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Courses> thisUsersSchedules() {
        CurrentUser currentUser = getCurrentUser();
        Iterable<Courses> courses = coursesRepository.findAllByPsId(currentUser.getUser().getId());
        return courses;
    }

    // fix this later
    @ApiOperation(value = "Get a single course (if it belongs to current user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Courses getScheduleById(
            @ApiParam("psId") @RequestParam Long psId) {
        // User currentUser = getCurrentUser().getUser();
        Courses courses = coursesRepository.findByPsId(psId)
            .orElseThrow(() -> new EntityNotFoundException(Courses.class, psId));

        return courses;
    }

    @ApiOperation(value = "Get a single course (no matter who it belongs to, admin only)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public Courses getScheduleById_admin(
            @ApiParam("id") @RequestParam Long id) {
              Courses courses = coursesRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Courses.class, id));

        return courses;
    }

    @ApiOperation(value = "Create a new course")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/post")
    public Courses postCourses(
            @ApiParam("enrollCd") @RequestParam String enrollCd,
            @ApiParam("psId") @RequestParam Long psId,
            @ApiParam("quarter") @RequestParam String quarter) {
        CurrentUser currentUser = getCurrentUser();
        log.info("currentUser={}", currentUser);

        Courses courses = new Courses();
        courses.setEnrollCd(enrollCd);
        courses.setPsId(psId);
        courses.setQuarter(quarter);
        Courses savedCourses = coursesRepository.save(courses);
        return savedCourses;
    }

    @ApiOperation(value = "Delete a course owned by this user")
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("")
    public Object deleteCourses(
            @ApiParam("id") @RequestParam Long psId) {
        // User currentUser = getCurrentUser().getUser();
        Courses courses = coursesRepository.findByPsId(psId)
          .orElseThrow(() -> new EntityNotFoundException(Courses.class, psId));

          coursesRepository.delete(courses);

        return genericMessage("Courses with id %s deleted".formatted(psId));

    }

    @ApiOperation(value = "Delete another user's courses")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin")
    public Object deleteCourses_Admin(
            @ApiParam("id") @RequestParam Long id) {
              Courses courses = coursesRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Courses.class, id));

          coursesRepository.delete(courses);

        return genericMessage("Courses with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a single course (if it belongs to current user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("")
    public Courses putCoursesById(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid Courses incomingCourses) {
        // User currentUser = getCurrentUser().getUser();
        Courses courses = coursesRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Courses.class, id));

        courses.setEnrollCd(incomingCourses.getEnrollCd());
        courses.setPsId(incomingCourses.getPsId());
        courses.setQuarter(incomingCourses.getQuarter());

        coursesRepository.save(courses);

        return courses;
    }

    @ApiOperation(value = "Update a single Course (regardless of ownership, admin only, can't change ownership)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin")
    public Courses putScheduleById_admin(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid Courses incomingCourses) {
              Courses courses = coursesRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Courses.class, id));

          courses.setEnrollCd(incomingCourses.getEnrollCd());
          courses.setPsId(incomingCourses.getPsId());
          courses.setQuarter(incomingCourses.getQuarter());

        coursesRepository.save(courses);

        return courses;
    }
    
}