package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.jobs.services.JobUserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Bridge between the lib-jobs library and this app's notion of "current user"; lib-jobs uses it to
 * stamp createdById/createdByEmail on Job records. Both values are null when there is no logged-in
 * user (e.g. jobs launched from a scheduled task).
 */
@Service
public class JobUserProviderImpl implements JobUserProvider {

  @Autowired private CurrentUserService currentUserService;

  @Override
  public Long getCurrentUserId() {
    User user = currentUserService.getUser();
    return user != null ? user.getId() : null;
  }

  @Override
  public String getCurrentUserEmail() {
    User user = currentUserService.getUser();
    return user != null ? user.getEmail() : null;
  }
}
