package edu.ucsb.cs156.courses.models;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;


import org.springframework.security.core.GrantedAuthority;
import edu.ucsb.cs156.courses.entities.User;

import java.util.Collection;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CurrentUser {
  private User user;
  private Collection<? extends GrantedAuthority> roles;
}
