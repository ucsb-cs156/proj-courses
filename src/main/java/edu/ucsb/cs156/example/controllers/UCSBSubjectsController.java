package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBSubject;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.example.services.UCSBSubjectsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Api(description = "API to handle CRUD operations for UCSB Subjects database")
@RequestMapping("/api/UCSBSubjects")
@RestController
public class UCSBSubjectsController extends ApiController {
    @Autowired
    UCSBSubjectRepository subjectRepository;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    UCSBSubjectsService ucsbSubjectsService;

    @ApiOperation(value = "Get all UCSB Subjects")
    @PreAuthorize("hasRole('ROLE_USER') || hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public Iterable<UCSBSubject> allSubjects() {
        Iterable<UCSBSubject> subjects = subjectRepository.findAll();
        return subjects;
    }

    @ApiOperation(value = "Load subjects into database from UCSB API")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/load")
    public List<UCSBSubject> loadSubjects() {
       
        List<UCSBSubject> subjects = ucsbSubjectsService.get();
        
        List<UCSBSubject> savedSubjects = new ArrayList<UCSBSubject>();

        subjects.forEach((ucsbSubject)->{
            try {
              subjectRepository.save(ucsbSubject);
              savedSubjects.add(ucsbSubject);
            } catch (DuplicateKeyException dke) {
                log.info("Skipping duplicate entity %s".formatted(ucsbSubject.getSubjectCode()));
            }
        });
        log.info("subjects={}",subjects);
        return savedSubjects;
    }

    @ApiOperation(value = "Get a single UCSB Subject by id if it is in the database")
    @PreAuthorize("hasRole('ROLE_USER') || hasRole('ROLE_ADMIN')")
    @GetMapping("")
    public UCSBSubject getSubjectById(
            @ApiParam("subjectCode") @RequestParam String subjectCode) throws JsonProcessingException {

        UCSBSubject subject = subjectRepository.findById(subjectCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBSubject.class, subjectCode));

        return subject;
    }

    @ApiOperation(value = "Delete a UCSB Subject by id")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteSubject(
            @ApiParam("subjectCode") @RequestParam String subjectCode) {

        UCSBSubject subject = subjectRepository.findById(subjectCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBSubject.class, subjectCode));

        subjectRepository.delete(subject);

        return genericMessage("UCSBSubject with id %s deleted".formatted(subjectCode));
    }

    @ApiOperation(value = "Delete all UCSB Subjects in the table")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/all")
    public Object deleteAllSubjects() {

        subjectRepository.deleteAll();

        return genericMessage("All UCSBSubject records deleted");
    }

}