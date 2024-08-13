package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.collections.UpdateCollection;
import edu.ucsb.cs156.courses.documents.Update;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@EnableConfigurationProperties(value = UpdateService.class)
public class UpdateServiceTests {
  @MockBean private UpdateCollection updateCollection;
  @Autowired private UpdateService updateService;

  @Test
  public void test_getLastUpdate_nonEmpty() throws Exception {
    LocalDateTime someDateTime = LocalDateTime.parse("2021-05-01T12:00:00");
    when(updateCollection.findBySubjectAreaAndQuarter(
            "CMPSC", "20221", PageRequest.of(0, 1, Direction.DESC, "lastUpdate")))
        .thenReturn(new PageImpl<>(List.of(Update.builder().lastUpdate(someDateTime).build())));
    Optional<LocalDateTime> optionalLastUpdate = updateService.getLastUpdate("CMPSC", "20221");
    assertEquals(someDateTime, optionalLastUpdate.get());
  }

  @Test
  public void test_getLastUpdate_empty() throws Exception {
    LocalDateTime someDateTime = LocalDateTime.parse("2021-05-01T12:00:00");
    when(updateCollection.findBySubjectAreaAndQuarter(
            "CMPSC", "20221", PageRequest.of(0, 1, Direction.DESC, "lastUpdate")))
        .thenReturn(new PageImpl<>(new ArrayList<Update>()));
    Optional<LocalDateTime> optionalLastUpdate = updateService.getLastUpdate("CMPSC", "20221");
    assertEquals(Optional.empty(), optionalLastUpdate);
  }
}
