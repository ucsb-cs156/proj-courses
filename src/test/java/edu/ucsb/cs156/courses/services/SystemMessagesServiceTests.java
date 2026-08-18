package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import edu.ucsb.cs156.courses.models.SystemMessage;
import java.util.List;
import org.junit.jupiter.api.Test;

public class SystemMessagesServiceTests {

  @Test
  public void getMessages_returnsEmptyList_whenNoneAdded() {
    SystemMessagesService service = new SystemMessagesService();

    assertTrue(service.getMessages().isEmpty());
  }

  @Test
  public void addMessage_appendsInOrder() {
    SystemMessagesService service = new SystemMessagesService();

    service.addMessage("warning", "first");
    service.addMessage("danger", "second");

    List<SystemMessage> messages = service.getMessages();
    assertEquals(2, messages.size());
    assertEquals(
        SystemMessage.builder().variant("warning").message("first").build(), messages.get(0));
    assertEquals(
        SystemMessage.builder().variant("danger").message("second").build(), messages.get(1));
  }

  @Test
  public void getMessages_returnsUnmodifiableList() {
    SystemMessagesService service = new SystemMessagesService();
    service.addMessage("info", "hello");

    List<SystemMessage> messages = service.getMessages();

    assertThrows(
        UnsupportedOperationException.class,
        () -> messages.add(SystemMessage.builder().variant("info").message("sneaky").build()));
  }
}
