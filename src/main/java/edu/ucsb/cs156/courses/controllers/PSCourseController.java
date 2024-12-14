package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.PSCourse;
import edu.ucsb.cs156.courses.entities.PersonalSchedule;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.errors.BadEnrollCdException;
import edu.ucsb.cs156.courses.errors.EntityNotFoundException;
import edu.ucsb.cs156.courses.models.CurrentUser;
import edu.ucsb.cs156.courses.repositories.PSCourseRepository;
import edu.ucsb.cs156.courses.repositories.PersonalScheduleRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Optional;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "PSCourse")
@RequestMapping("/api/courses")
@RestController
@Slf4j
public class PSCourseController extends ApiController {

  @Autowired PSCourseRepository coursesRepository;
  @Autowired PersonalScheduleRepository personalScheduleRepository;
  @Autowired UCSBCurriculumService ucsbCurriculumService;
  @Autowired ObjectMapper mapper;

  @Operation(summary = "List all courses (admin)")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping("/admin/all")
  public Iterable<PSCourse> allUsersCourses() {
    Iterable<PSCourse> courses = coursesRepository.findAll();
    return courses;
  }

  @Operation(summary = "List all courses (user)")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/user/all")
  public Iterable<PSCourse> thisUsersCourses() {
    CurrentUser currentUser = getCurrentUser();
    Iterable<PSCourse> courses = coursesRepository.findAllByUserId(currentUser.getUser().getId());
    return courses;
  }

  @Operation(summary = "List all courses for a specified psId (admin)")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping("/admin/psid/all")
  public Iterable<PSCourse> allCoursesForPsId(@Parameter(name = "psId") @RequestParam Long psId) {
    Iterable<PSCourse> courses = coursesRepository.findAllByPsId(psId);
    return courses;
  }

  @Operation(summary = "List all courses for a specified psId (user)")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/user/psid/all")
  public Iterable<PSCourse> thisUsersCoursesForPsId(
      @Parameter(name = "psId") @RequestParam Long psId) {
    User currentUser = getCurrentUser().getUser();
    Iterable<PSCourse> courses = coursesRepository.findAllByPsIdAndUser(psId, currentUser);
    return courses;
  }

  @Operation(summary = "Get a single course (admin)")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping("/admin")
  public PSCourse getCourseById_admin(@Parameter(name = "id") @RequestParam Long id) {
    PSCourse courses =
        coursesRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

    return courses;
  }

  @Operation(summary = "Get a single course (user)")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/user")
  public PSCourse getCourseById(@Parameter(name = "id") @RequestParam Long id) {
    User currentUser = getCurrentUser().getUser();
    PSCourse courses =
        coursesRepository
            .findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

    return courses;
  }

  @Operation(summary = "Create a new course")
  @PreAuthorize("hasRole('ROLE_USER')")
  @PostMapping("/post")
  public ArrayList<PSCourse> postCourses(
      @Parameter(name = "enrollCd") @RequestParam String enrollCd,
      @Parameter(name = "psId") @RequestParam Long psId)
      throws Exception {
    CurrentUser currentUser = getCurrentUser();
    log.info("currentUser={}", currentUser);

    PersonalSchedule checkPsId =
        personalScheduleRepository
            .findByIdAndUser(psId, currentUser.getUser())
            .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, psId));

    String body = ucsbCurriculumService.getAllSections(enrollCd, checkPsId.getQuarter());
    if (body.equals("{\"error\": \"401: Unauthorized\"}")
        || body.equals("{\"error\": \"Enroll code doesn't exist in that quarter.\"}")) {
      throw new BadEnrollCdException(enrollCd);
    }

    // may cause significant slowdowns if there are very large sections
    String enrollCdPrimary = null;
    String enrollCdPreviousSecondary = null;
    boolean hasSecondary = false;
    boolean hasPreviousSecondary = false;
    Iterator<JsonNode> it = mapper.readTree(body).path("classSections").elements();
    while (it.hasNext()) {
      JsonNode classSection = it.next();
      String section = classSection.path("section").asText();
      String currentEnrollCd = classSection.path("enrollCode").asText();

      if (section.endsWith("00")) {
        enrollCdPrimary = currentEnrollCd;
      } else if (coursesRepository.findByPsIdAndEnrollCd(psId, currentEnrollCd).isPresent()) {
        enrollCdPreviousSecondary = currentEnrollCd;
        hasPreviousSecondary = true;
      } else {
        hasSecondary = true;
      }
    }

    if (enrollCdPrimary == null) {
      enrollCdPrimary = enrollCd;
      hasSecondary = false;
      hasPreviousSecondary = false;
    }

    if (!hasPreviousSecondary
        && coursesRepository.findByPsIdAndEnrollCd(psId, enrollCdPrimary).isPresent()) {
      throw new IllegalArgumentException("class exists in schedule");
    }

    ArrayList<PSCourse> savedCourses = new ArrayList<>();

    if (hasPreviousSecondary) {
      Optional<PSCourse> secondaryOptional =
          coursesRepository.findByPsIdAndEnrollCd(psId, enrollCdPreviousSecondary);
      PSCourse secondary = secondaryOptional.get();

      PSCourse oldSection = new PSCourse();
      oldSection.setUser(currentUser.getUser());
      oldSection.setEnrollCd(secondary.getEnrollCd());
      oldSection.setPsId(secondary.getPsId());

      secondary.setEnrollCd(enrollCd);
      PSCourse newSection = coursesRepository.save(secondary);

      PSCourse primary = new PSCourse();
      primary.setUser(currentUser.getUser());
      primary.setEnrollCd(enrollCdPrimary);
      primary.setPsId(psId);

      savedCourses.add(primary);
      savedCourses.add(newSection);
      savedCourses.add(oldSection);
      return savedCourses;
    }

    if (!enrollCdPrimary.equals(enrollCd)) {
      String enrollCdSecondary = enrollCd;
      PSCourse secondary = new PSCourse();
      secondary.setUser(currentUser.getUser());
      secondary.setEnrollCd(enrollCdSecondary);
      secondary.setPsId(psId);
      coursesRepository.save(secondary);
      savedCourses.add(secondary);
    } else if (hasSecondary) {
      throw new IllegalArgumentException(
          enrollCd
              + " is for a course with sections; please add a specific section and the lecture will be automatically added");
    }

    PSCourse primary = new PSCourse();
    primary.setUser(currentUser.getUser());
    primary.setEnrollCd(enrollCdPrimary);
    primary.setPsId(psId);
    coursesRepository.save(primary);
    savedCourses.add(primary);

    return savedCourses;
  }

  @Operation(summary = "Delete a course (admin)")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("/admin")
  public Object deleteCourses_Admin(@Parameter(name = "id") @RequestParam Long id) {
    PSCourse courses =
        coursesRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

    coursesRepository.delete(courses);

    return genericMessage("PSCourse with id %s deleted".formatted(id));
  }

  @Operation(summary = "Delete a course (user)")
  @PreAuthorize("hasRole('ROLE_USER')")
  @DeleteMapping("/user")
  public Object deleteCourses(@Parameter(name = "id") @RequestParam Long id) throws Exception {
    User currentUser = getCurrentUser().getUser();
    PSCourse psCourse =
        coursesRepository
            .findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));
    long psId = psCourse.getPsId();
    PersonalSchedule checkPsId =
        personalScheduleRepository
            .findByIdAndUser(psId, currentUser)
            .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, psId));

    String body =
        ucsbCurriculumService.getAllSections(psCourse.getEnrollCd(), checkPsId.getQuarter());
    if (body.equals("{\"error\": \"401: Unauthorized\"}")
        || body.equals("{\"error\": \"Enroll code doesn't exist in that quarter.\"}")) {
      coursesRepository.delete(psCourse);
      return genericMessage("PSCourse with id %s deleted".formatted(id));
    }

    Iterator<JsonNode> it = mapper.readTree(body).path("classSections").elements();
    Optional<Long> primaryId = Optional.empty();
    Optional<Long> secondaryId = Optional.empty();
    while (it.hasNext()) {
      JsonNode classSection = it.next();
      String section = classSection.path("section").asText();
      String currentEnrollCd = classSection.path("enrollCode").asText();
      Optional<PSCourse> currentPsCourse =
          coursesRepository.findByPsIdAndEnrollCd(psId, currentEnrollCd);
      if (!currentPsCourse.isPresent()) continue;
      Optional<Long> idOpt = Optional.of(currentPsCourse.get().getId());
      if (section.endsWith("00")) primaryId = idOpt;
      else secondaryId = idOpt;
      coursesRepository.delete(currentPsCourse.get());
    }

    if (primaryId.isPresent() && secondaryId.isPresent()) {
      if (primaryId.get() == id)
        return genericMessage(
            "PSCourse with id %s and matching secondary with id %s deleted"
                .formatted(id, secondaryId.get()));
      else
        return genericMessage(
            "PSCourse with id %s and matching primary with id %s deleted"
                .formatted(id, primaryId.get()));
    }

    return genericMessage("PSCourse with id %s deleted".formatted(id));
  }

  @Operation(summary = "Delete a course with psid and enroll code (user)")
  @PreAuthorize("hasRole('ROLE_USER')")
  @DeleteMapping("/user/psid")
  public Object deleteCourses_PSID(
      @Parameter(name = "enrollCd") @RequestParam String enrollCd,
      @Parameter(name = "psId") @RequestParam Long psId)
      throws Exception {
    User currentUser = getCurrentUser().getUser();

    PSCourse psCourse =
        coursesRepository
            .findByPsIdAndEnrollCd(psId, enrollCd)
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        PSCourse.class, "psId", psId, "enrollCode", enrollCd));
    long id = psCourse.getId();
    PersonalSchedule checkPsId =
        personalScheduleRepository
            .findByIdAndUser(psId, currentUser)
            .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, psId));

    String body =
        ucsbCurriculumService.getAllSections(psCourse.getEnrollCd(), checkPsId.getQuarter());
    if (body.equals("{\"error\": \"401: Unauthorized\"}")
        || body.equals("{\"error\": \"Enroll code doesn't exist in that quarter.\"}")) {
      coursesRepository.delete(psCourse);
      return genericMessage(
          "PSCourse with psId %s and enroll code %s deleted".formatted(psId, enrollCd));
    }

    Iterator<JsonNode> it = mapper.readTree(body).path("classSections").elements();
    Optional<Long> primaryId = Optional.empty();
    Optional<Long> secondaryId = Optional.empty();
    while (it.hasNext()) {
      JsonNode classSection = it.next();
      String section = classSection.path("section").asText();
      String currentEnrollCd = classSection.path("enrollCode").asText();
      Optional<PSCourse> currentPsCourse =
          coursesRepository.findByPsIdAndEnrollCd(psId, currentEnrollCd);
      if (!currentPsCourse.isPresent()) continue;
      Optional<Long> idOpt = Optional.of(currentPsCourse.get().getId());
      if (section.endsWith("00")) primaryId = idOpt;
      else secondaryId = idOpt;
      coursesRepository.delete(currentPsCourse.get());
    }

    if (primaryId.isPresent() && secondaryId.isPresent()) {
      if (primaryId.get() == id)
        return genericMessage(
            "PSCourse with id %s and matching secondary with id %s deleted"
                .formatted(id, secondaryId.get()));
      else
        return genericMessage(
            "PSCourse with id %s and matching primary with id %s deleted"
                .formatted(id, primaryId.get()));
    }

    return genericMessage(
        "PSCourse with psId %s and enroll code %s deleted".formatted(psId, enrollCd));
  }

  @Operation(summary = "Update a single Course (admin)")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PutMapping("/admin")
  public PSCourse putCourseById_admin(
      @Parameter(name = "id") @RequestParam Long id, @RequestBody @Valid PSCourse incomingCourses) {
    PSCourse courses =
        coursesRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

    courses.setEnrollCd(incomingCourses.getEnrollCd());
    courses.setPsId(incomingCourses.getPsId());

    coursesRepository.save(courses);

    return courses;
  }

  @Operation(summary = "Update a single course (user)")
  @PreAuthorize("hasRole('ROLE_USER')")
  @PutMapping("/user")
  public PSCourse putCoursesById(
      @Parameter(name = "id") @RequestParam Long id, @RequestBody @Valid PSCourse incomingCourses) {
    User currentUser = getCurrentUser().getUser();
    PSCourse courses =
        coursesRepository
            .findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

    courses.setEnrollCd(incomingCourses.getEnrollCd());
    courses.setPsId(incomingCourses.getPsId());

    coursesRepository.save(courses);

    return courses;
  }
}
