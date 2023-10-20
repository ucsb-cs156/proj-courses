package edu.ucsb.cs156.courses.models;

import edu.ucsb.cs156.courses.entities.User;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CurrentUser {
    private User user;
    private Collection<? extends GrantedAuthority> roles;
}
