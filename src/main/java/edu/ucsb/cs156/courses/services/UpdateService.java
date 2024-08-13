package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.collections.UpdateCollection;
import edu.ucsb.cs156.courses.documents.Update;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

@Service("UpdateService")
@ConfigurationProperties
public class UpdateService {
  /**
   * Get the last update for a given subject area and quarter
   *
   * @param updateCollection
   * @param subjectArea
   * @param quarterYYYYQ
   * @return the last update
   * @throws Exception
   */
  @Autowired private UpdateCollection updateCollection;

  public Optional<LocalDateTime> getLastUpdate(String subjectArea, String quarterYYYYQ)
      throws Exception {

    PageRequest pageRequest_0_1_DESC_lastUpdate =
        PageRequest.of(0, 1, Direction.DESC, "lastUpdate");

    Page<Update> updatePage =
        updateCollection.findBySubjectAreaAndQuarter(
            subjectArea, quarterYYYYQ, pageRequest_0_1_DESC_lastUpdate);
    if (updatePage.getTotalElements() == 0) {
      return Optional.empty();
    }
    Update update = updatePage.getContent().get(0);
    return Optional.of(update.getLastUpdate());
  }
}
