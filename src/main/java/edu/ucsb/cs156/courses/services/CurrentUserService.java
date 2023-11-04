package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.models.CurrentUser;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;

public abstract class CurrentUserService {
  public abstract User getUser();

  public abstract CurrentUser getCurrentUser();

  public abstract Collection<? extends GrantedAuthority> getRoles();

  public final boolean isLoggedIn() {
    return getUser() != null;
  }
}
