package edu.ucsb.cs156.courses.models;

import edu.ucsb.cs156.courses.entities.User;
import java.util.Collection;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CurrentUser {
  private User user;
  private Collection<? extends GrantedAuthority> roles;
}
