package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.entities.UCSBSubject;
import edu.ucsb.cs156.courses.errors.EntityNotFoundException;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.courses.services.UCSBSubjectsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Tag(name = "API to handle CRUD operations for UCSB Subjects database")
@RequestMapping("/api/UCSBSubjects")
@RestController
public class UCSBSubjectsController extends ApiController {
  @Autowired UCSBSubjectRepository subjectRepository;

  @Autowired ObjectMapper mapper;

  @Autowired UCSBSubjectsService ucsbSubjectsService;

  @Operation(summary = "Get all UCSB Subjects")
  @GetMapping("/all")
  public Iterable<UCSBSubject> allSubjects() {
    Iterable<UCSBSubject> subjects = subjectRepository.findAll();
    return subjects;
  }

  @Operation(summary = "Load subjects into database from UCSB API")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/load")
  public List<UCSBSubject> loadSubjects() throws JsonProcessingException {

    List<UCSBSubject> subjects = ucsbSubjectsService.get();

    List<UCSBSubject> savedSubjects = new ArrayList<UCSBSubject>();

    subjects.forEach(
        (ucsbSubject) -> {
          try {
            subjectRepository.save(ucsbSubject);
            savedSubjects.add(ucsbSubject);
          } catch (DuplicateKeyException dke) {
            log.info("Skipping duplicate entity %s".formatted(ucsbSubject.getSubjectCode()));
          }
        });
    log.info("subjects={}", subjects);
    return savedSubjects;
  }

  @Operation(summary = "Get a single UCSB Subject by id if it is in the database")
  @PreAuthorize("hasRole('ROLE_USER') || hasRole('ROLE_ADMIN')")
  @GetMapping("")
  public UCSBSubject getSubjectById(
      @Parameter(name = "subjectCode") @RequestParam String subjectCode)
      throws JsonProcessingException {

    UCSBSubject subject =
        subjectRepository
            .findById(subjectCode)
            .orElseThrow(() -> new EntityNotFoundException(UCSBSubject.class, subjectCode));

    return subject;
  }

  @Operation(summary = "Delete a UCSB Subject by id")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("")
  public Object deleteSubject(@Parameter(name = "subjectCode") @RequestParam String subjectCode) {

    UCSBSubject subject =
        subjectRepository
            .findById(subjectCode)
            .orElseThrow(() -> new EntityNotFoundException(UCSBSubject.class, subjectCode));

    subjectRepository.delete(subject);

    return genericMessage("UCSBSubject with id %s deleted".formatted(subjectCode));
  }

  @Operation(summary = "Delete all UCSB Subjects in the table")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("/all")
  public Object deleteAllSubjects() {

    subjectRepository.deleteAll();

    return genericMessage("All UCSBSubject records deleted");
  }
}
