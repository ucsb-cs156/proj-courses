package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.models.SystemMessage;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Service;

/**
 * Holds system messages (e.g. startup misconfiguration warnings) for the lifetime of the running
 * process. Deliberately in-memory rather than persisted: a {@code @Service} bean is a Spring
 * singleton by default, so this naturally starts empty on every process start with no explicit
 * "clear on startup" step required, and -- should this app ever run multiple instances -- each
 * instance reports its own diagnostics rather than a shared table conflating them.
 */
@Service
public class SystemMessagesService {

  private final List<SystemMessage> messages = new CopyOnWriteArrayList<>();

  public void addMessage(String variant, String message) {
    messages.add(SystemMessage.builder().variant(variant).message(message).build());
  }

  public List<SystemMessage> getMessages() {
    return Collections.unmodifiableList(messages);
  }
}
