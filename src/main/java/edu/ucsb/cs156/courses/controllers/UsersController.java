package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User information (admin only)")
@RequestMapping("/api/admin/users")
@RestController
public class UsersController extends ApiController {
  @Autowired UserRepository userRepository;

  @Operation(summary = "Get a paginated list of users")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @GetMapping(value = "/paginated", produces = "application/json")
  public Page<User> getUsersPaginated(
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
              description = "sort field",
              example = "email",
              required = false)
          @RequestParam(defaultValue = "id")
          String sortField,
      @Parameter(
              name = "sortDirection",
              description = "sort direction",
              example = "ASC",
              required = false)
          @RequestParam(defaultValue = "ASC")
          String sortDirection) {

    List<String> allowedSortFields = Arrays.asList("id", "email", "givenName", "familyName");

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

    Direction sortDirectionObject = Direction.ASC;
    if (sortDirection.equals("DESC")) {
      sortDirectionObject = Direction.DESC;
    }

    PageRequest pageRequest = PageRequest.of(page, pageSize, sortDirectionObject, sortField);
    return userRepository.findAll(pageRequest);
  }
}
