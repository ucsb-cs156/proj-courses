package edu.ucsb.cs156.courses.services;

import java.io.Reader;
import java.util.List;

import edu.ucsb.cs156.courses.entities.GradeHistory;

public interface UCSBGradeHistoryService {
    public List<String> getUrls() throws Exception;
    public List<GradeHistory> getGradeData(String url) throws Exception;
    public List<GradeHistory> parse(Reader reader) throws Exception;
}