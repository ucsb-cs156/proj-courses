package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.UpdateCollection;
import edu.ucsb.cs156.courses.documents.Update;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Tag(name = "Updates", description = "API for course history updates")
@RequestMapping("/api/updates")
@RestController
public class UpdateController extends ApiController {
  @Autowired UpdateCollection updateCollection;

  @Autowired ObjectMapper mapper;

  @Operation(summary = "Get updates for a subject area and quarter")
  @GetMapping(value = "", produces = "application/json")
  public Iterable<Update> getUpdates(
      @Parameter(
              name = "subjectArea",
              description = "Course subject area code",
              example = "CMPSC",
              required = true)
          @RequestParam
          String subjectArea,
      @Parameter(
              name = "quarter",
              description = "Quarter in yyyyq format",
              example = "20221",
              required = true)
          @RequestParam
          String quarter,
      @Parameter(
              name = "page",
              description = "what page of the data",
              example = "0",
              required = true)
          @RequestParam
          int page,
      @Parameter(
              name = "pageSize",
              description = "size of each page",
              example = "5",
              required = true)
          @RequestParam
          int pageSize) {
    Iterable<Update> updates = null;
    PageRequest pageRequest = PageRequest.of(page, pageSize, Direction.DESC, "lastUpdate");

    if (subjectArea.toUpperCase().equals("ALL") && quarter.toUpperCase().equals("ALL")) {
      updates = updateCollection.findAll(pageRequest);
    } else if (subjectArea.toUpperCase().equals("ALL")) {
      updates = updateCollection.findByQuarter(quarter, pageRequest);
    } else if (quarter.toUpperCase().equals("ALL")) {
      updates = updateCollection.findBySubjectArea(subjectArea, pageRequest);
    } else {
      updates = updateCollection.findBySubjectAreaAndQuarter(subjectArea, quarter, pageRequest);
    }
    log.info("updates: {}", updates);
    return updates;
  }
}
