package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.entities.RateLimitedIP;
import edu.ucsb.cs156.courses.repositories.RateLimitedIPRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Arrays;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Rate Limited IPs")
@RequestMapping("/api/admin/rate-limited-ips")
@RestController
@Slf4j
public class RateLimitedIPsController extends ApiController {

  @Autowired private RateLimitedIPRepository rateLimitedIPRepository;

  @Operation(summary = "Get a paginated list of rate-limited IP addresses")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping(value = "", produces = "application/json")
  public Page<RateLimitedIP> getRateLimitedIPs(
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
              example = "10",
              required = true)
          @RequestParam
          int pageSize,
      @Parameter(
              name = "sortField",
              description = "sort field (requestCount or lastRequestAt)",
              example = "requestCount",
              required = false)
          @RequestParam(defaultValue = "requestCount")
          String sortField,
      @Parameter(
              name = "sortDirection",
              description = "sort direction (ASC or DESC)",
              example = "DESC",
              required = false)
          @RequestParam(defaultValue = "DESC")
          String sortDirection) {

    List<String> allowedSortFields = Arrays.asList("requestCount", "lastRequestAt");
    if (!allowedSortFields.contains(sortField)) {
      throw new IllegalArgumentException(
          String.format(
              "%s is not a valid sort field. Valid values are %s", sortField, allowedSortFields));
    }

    List<String> allowedSortDirections = Arrays.asList("ASC", "DESC");
    if (!allowedSortDirections.contains(sortDirection)) {
      throw new IllegalArgumentException(
          String.format(
              "%s is not a valid sort direction. Valid values are %s",
              sortDirection, allowedSortDirections));
    }

    Direction sortDirectionObject = sortDirection.equals("ASC") ? Direction.ASC : Direction.DESC;

    PageRequest pageRequest = PageRequest.of(page, pageSize, sortDirectionObject, sortField);
    return rateLimitedIPRepository.findAll(pageRequest);
  }
}
