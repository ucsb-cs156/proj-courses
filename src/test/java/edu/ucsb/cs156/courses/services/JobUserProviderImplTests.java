package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.entities.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class JobUserProviderImplTests {

  @Mock CurrentUserService currentUserService;

  @InjectMocks JobUserProviderImpl jobUserProvider;

  @Test
  public void returns_id_and_email_of_logged_in_user() {
    User user = User.builder().id(42L).email("cgaucho@ucsb.edu").build();
    when(currentUserService.getUser()).thenReturn(user);

    assertEquals(42L, jobUserProvider.getCurrentUserId());
    assertEquals("cgaucho@ucsb.edu", jobUserProvider.getCurrentUserEmail());
  }

  @Test
  public void returns_nulls_when_no_user_is_logged_in() {
    when(currentUserService.getUser()).thenReturn(null);

    assertNull(jobUserProvider.getCurrentUserId());
    assertNull(jobUserProvider.getCurrentUserEmail());
  }
}
