package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.entities.GradeHistory;
import java.io.Reader;
import java.util.List;

public interface UCSBGradeHistoryService {
  public List<String> getUrls() throws Exception;

  public List<GradeHistory> getGradeData(String url) throws Exception;

  public List<GradeHistory> parse(Reader reader) throws Exception;
}
