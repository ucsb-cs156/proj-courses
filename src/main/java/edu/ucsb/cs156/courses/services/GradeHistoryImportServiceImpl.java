package edu.ucsb.cs156.courses.services;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import edu.ucsb.cs156.courses.entities.GradeHistory;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.utilities.CourseUtilities;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class GradeHistoryImportServiceImpl implements GradeHistoryImportService {

  public static class NullHeaderException extends RuntimeException {
    public NullHeaderException(String message) {
      super(message);
    }
  }

  @Autowired private JdbcTemplate jdbcTemplate;

  @Autowired private RestTemplate restTemplate;

  @Override
  public void importGradesFromUrl(String url, JobContext ctx, int batchSize) throws Exception {
    final int[] recordsProcessed = {0};

    restTemplate.execute(
        url,
        HttpMethod.GET,
        null,
        response -> {
          try (BufferedReader reader =
                  new BufferedReader(new InputStreamReader(response.getBody()));
              CSVReader csvReader = new CSVReaderBuilder(reader).build()) {

            String[] header = csvReader.readNext();
            if (header == null) throw new NullHeaderException("CSV header is missing");

            Map<String, Integer> col = mapHeaders(header);
            List<GradeHistory> buffer = new ArrayList<>();
            String[] nextLine;

            while ((nextLine = csvReader.readNext()) != null) {
              List<GradeHistory> gradesFromLine = mapLineToGrades(nextLine, col);
              buffer.addAll(gradesFromLine);

              if (buffer.size() >= batchSize) {
                flushBuffer(buffer, batchSize);
                recordsProcessed[0] += buffer.size();
                ctx.log("Processed " + recordsProcessed[0] + " grade history records so far.");
                buffer.clear();
              }
            }
            recordsProcessed[0] += buffer.size();
            ctx.log("Processed " + recordsProcessed[0] + " grade history records. Done!");
            flushBuffer(buffer, batchSize);

          } catch (NullHeaderException nhe) {
            log.error("Error processing CSV from URL: {}", url, nhe);
            throw nhe;
          } catch (Exception e) {
            log.error("Error processing CSV from URL: {}", url, e);
            throw new RuntimeException("CSV processing failed", e);
          }
          return null;
        });
  }

  private Map<String, Integer> mapHeaders(String[] header) {
    Map<String, Integer> map = new HashMap<>();
    for (int i = 0; i < header.length; i++) {
      map.put(header[i].trim(), i);
    }
    return map;
  }

  private List<GradeHistory> mapLineToGrades(String[] line, Map<String, Integer> col) {
    List<GradeHistory> list = new ArrayList<>();

    String year = line[col.get("year")];
    String quarter = line[col.get("quarter")];
    String yyyyq = year + CourseUtilities.quarterToDigit(quarter);
    String course = line[col.get("course")];
    String instructor = line[col.get("instructor")];

    // Map column names to cleaned Grade strings
    String[] gradeCols = {
      "Ap", "A", "Am", "Bp", "B", "Bm", "Cp", "C", "Cm", "Dp", "D", "Dm", "F", "P", "S"
    };

    for (String grade : gradeCols) {
      if (col.containsKey(grade)) {
        String val = line[col.get(grade)];
        String convertedGrade = grade.replace("p", "+").replace("m", "-");
        int count = (val.isEmpty()) ? 0 : Integer.parseInt(val);
        if (count > 0) {
          list.add(
              GradeHistory.builder()
                  .yyyyq(yyyyq)
                  .course(course)
                  .instructor(instructor)
                  .grade(convertedGrade)
                  .count(count)
                  .build());
        }
      }
    }

    int countNP = calculateNP(line, col);
    if (countNP > 0) {
      list.add(
          GradeHistory.builder()
              .yyyyq(yyyyq)
              .course(course)
              .instructor(instructor)
              .grade("NP")
              .count(countNP)
              .build());
    }
    return list;
  }

  private int calculateNP(String[] line, Map<String, Integer> col) {
    String pVal = line[col.get("P")];
    String nPnpVal = line[col.get("nPNPStudents")];

    int pCount = (pVal.isEmpty()) ? 0 : Integer.parseInt(pVal);
    int nPnpCount = (nPnpVal.isEmpty()) ? 0 : Integer.parseInt(nPnpVal);

    return nPnpCount - pCount;
  }

  /**
   * This method flushes the buffer to the database in batches. It is public so that it can be spied
   * on using Mockito in the unit tests.
   *
   * @param buffer
   * @param batchSize
   */
  public void flushBuffer(List<GradeHistory> buffer, int batchSize) {
    // Note: 'count' is excluded from the ON clause because it is the value we want
    // to update
    String sql =
        """
            MERGE INTO "historygrade" AS t
            USING (VALUES (?, ?, ?, ?, ?)) AS s(yyyyq, course, instructor, grade, count)
            ON (t."yyyyq" = s.yyyyq AND t."course" = s.course AND t."instructor" = s.instructor AND t."grade" = s.grade)
            WHEN MATCHED THEN
                UPDATE SET "count" = s.count
            WHEN NOT MATCHED THEN
                INSERT ("yyyyq", "course", "instructor", "grade", "count")
                VALUES (s.yyyyq, s.course, s.instructor, s.grade, s.count);
        """;

    jdbcTemplate.batchUpdate(sql, buffer, batchSize, this::updateEntity);
  }

  public void updateEntity(PreparedStatement ps, GradeHistory entity) throws SQLException {
    ps.setString(1, entity.getYyyyq());
    ps.setString(2, entity.getCourse());
    ps.setString(3, entity.getInstructor());
    ps.setString(4, entity.getGrade());
    ps.setInt(5, entity.getCount());
  }
}
