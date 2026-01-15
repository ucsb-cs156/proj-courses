package edu.ucsb.cs156.courses.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import edu.ucsb.cs156.courses.entities.GradeHistory;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import java.sql.PreparedStatement;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

@RestClientTest(GradeHistoryImportServiceImpl.class)
class GradeHistoryImportServiceImplTests {

  @TestConfiguration
  static class TestConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
      return builder.build();
    }
  }

  @MockitoBean UserRepository userRepository;

  @MockitoBean GradeHistoryRepository gradeHistoryRepository;

  @MockitoBean JdbcTemplate jdbcTemplate;

  @Autowired private GradeHistoryImportServiceImpl gradeHistoryImportServiceImpl;

  @Autowired private MockRestServiceServer mockRestServiceServer;

  @Mock private RestTemplate restTemplate;

  @Test
  void test_noHeaderThrowsException() throws Exception {

    String expectedURL = "https://example.com/grades.csv";
    String expectedResult = "";

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

    Job job = Job.builder().build();
    JobContext jobContext = new JobContext(null, job);
    // Expect the next line to throw an exception
    assertThrows(
        GradeHistoryImportServiceImpl.NullHeaderException.class,
        () -> {
          gradeHistoryImportServiceImpl.importGradesFromUrl(
              "https://example.com/grades.csv", jobContext, 10);
        });
  }

  @Test
  void test_importGradesFromUrl() throws Exception {

    String expectedURL = "https://example.com/grades.csv";
    String expectedResult =
        """
        course,instructor,quarter,year,A,B,C,D,F,nLetterStudents,nPNPStudents,avgGPA,P,dept,S,su,Ap,Bp,Cp,Dp,Am,Bm,Cm,Dm,IP
        CMPSC     5A,CONRAD P T,Spring,2025,50,13,2,1,3,122,0,3.4188524590163936,0,CMPSC,0,0,10,7,2,1,22,6,3,2,0
        CMPSC     9,KHARITONOVA Y,Spring,2025,42,14,13,7,11,153,0,2.7542483660130723,0,CMPSC,0,0,6,11,8,5,11,13,9,3,0
        CMPSC    16,MAJEDI M,Spring,2025,15,8,8,0,13,87,0,2.3,0,CMPSC,0,0,0,10,4,6,7,5,3,8,0
        CMPSC    24,MIRZA D,Spring,2025,36,18,10,1,6,140,0,3.1900000000000004,0,CMPSC,0,0,17,9,7,1,18,17,0,0,0
        CMPSC    32,NASIR N,Spring,2025,38,5,2,1,2,132,0,3.5939393939393938,0,CMPSC,0,0,32,14,1,0,27,9,1,0,0
        CMPSC    40,MAJEDI M,Spring,2025,54,6,1,0,4,108,0,3.4416666666666664,0,CMPSC,0,0,2,15,4,1,12,8,1,0,0
        CMPSC    64,MATNI Z A,Spring,2025,32,9,2,2,0,77,0,3.485714285714286,0,CMPSC,0,0,2,13,1,0,12,3,1,0,0
        CMPSC   111,MATNI Z A,Spring,2025,5,8,1,1,1,37,0,3.0594594594594597,0,CMPSC,0,0,3,5,6,0,5,2,0,0,0
        CMPSC   130A,NASIR N,Spring,2025,25,7,4,2,1,86,0,3.3651162790697673,0,CMPSC,0,0,15,11,4,0,9,6,2,0,0
        CMPSC   130B,SINGH A K,Spring,2025,12,8,13,4,3,67,0,2.719402985074627,0,CMPSC,0,0,3,5,9,0,5,4,1,0,0
        CMPSC   134,VIGODA E J,Spring,2025,28,1,0,0,1,38,0,3.736842105263158,0,CMPSC,0,0,0,3,1,0,4,0,0,0,0
        CMPSC   138,EL ABBADI A,Spring,2025,12,10,6,2,0,41,0,3.031707317073171,0,CMPSC,0,0,2,1,4,0,2,1,1,0,0
        CMPSC   154,BALKIND J M,Spring,2025,64,4,1,0,1,110,0,3.7199999999999998,0,CMPSC,0,0,0,17,0,0,22,0,1,0,0
        CMPSC   156,CONRAD P T,Spring,2025,71,0,0,0,0,96,0,3.923958333333333,0,CMPSC,0,0,2,1,0,0,22,0,0,0,0
        FAKE    123,CONRAD P T,Spring,2025,71,0,0,0,0,96,10,3.923958333333333,7,FAKE,0,0,2,1,0,0,22,0,0,0,0
        """;

    String expectedLog =
        """
Processed 13 grade history records so far.
Processed 26 grade history records so far.
Processed 37 grade history records so far.
Processed 48 grade history records so far.
Processed 59 grade history records so far.
Processed 70 grade history records so far.
Processed 80 grade history records so far.
Processed 90 grade history records so far.
Processed 101 grade history records so far.
Processed 112 grade history records so far.
Processed 118 grade history records so far.
Processed 128 grade history records so far.
Processed 135 grade history records so far.
Processed 139 grade history records so far.
Processed 145 grade history records so far.
Processed 145 grade history records. Done!""";

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));
    GradeHistoryImportServiceImpl spy = Mockito.spy(gradeHistoryImportServiceImpl);
    Mockito.doNothing().when(spy).flushBuffer(Mockito.anyList(), Mockito.anyInt());

    Job job = Job.builder().build();
    JobContext jobContext = new JobContext(null, job);
    spy.importGradesFromUrl("https://example.com/grades.csv", jobContext, 1);

    assertEquals(expectedLog, jobContext.getJob().getLog());

    verify(spy, Mockito.times(16)).flushBuffer(Mockito.anyList(), anyInt());
  }

  @Test
  void test_importGradesFromUrl_testBoundaryConditions() throws Exception {

    String expectedURL = "https://example.com/grades.csv";
    String expectedResult =
        """
        course,instructor,quarter,year,A,B,C,D,F,nLetterStudents,nPNPStudents,avgGPA,P,dept,S,su,Ap,Bp,Cp,Dp,Am,Bm,Cm,Dm,IP
        CMPSC     5A,CONRAD P T,Spring,2025,50,13,2,1,3,122,0,3.4188524590163936,0,CMPSC,0,0,10,7,2,1,22,6,3,2,0
        FAKE    123,CONRAD P T,Spring,2025,71,0,0,0,0,96,10,3.923958333333333,7,FAKE,0,0,2,1,0,0,22,0,0,0,0
        """;

    String expectedLog =
        """
Processed 13 grade history records so far.
Processed 19 grade history records. Done!""";

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));
    GradeHistoryImportServiceImpl spy = Mockito.spy(gradeHistoryImportServiceImpl);
    Mockito.doNothing().when(spy).flushBuffer(Mockito.anyList(), Mockito.anyInt());

    Job job = Job.builder().build();
    JobContext jobContext = new JobContext(null, job);
    spy.importGradesFromUrl("https://example.com/grades.csv", jobContext, 13);

    assertEquals(expectedLog, jobContext.getJob().getLog());

    verify(spy, Mockito.times(2)).flushBuffer(Mockito.anyList(), anyInt());
  }

  @Test
  void test_importGradesFromUrl_testNPCount() throws Exception {

    String expectedURL = "https://example.com/grades.csv";
    String expectedResult =
        """
        course,instructor,quarter,year,A,B,C,D,F,nLetterStudents,nPNPStudents,avgGPA,P,dept,S,su,Ap,Bp,Cp,Dp,Am,Bm,Cm,Dm,IP
        FAKE    123,CONRAD P T,Spring,2025,0,0,0,0,0,0,10,3.923958333333333,7,FAKE,0,0,0,0,0,0,0,0,0,0,0
        """;

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));
    GradeHistoryImportServiceImpl spy = Mockito.spy(gradeHistoryImportServiceImpl);
    Mockito.doNothing().when(spy).flushBuffer(Mockito.anyList(), Mockito.anyInt());

    Job job = Job.builder().build();
    JobContext jobContext = new JobContext(null, job);
    spy.importGradesFromUrl("https://example.com/grades.csv", jobContext, 13);

    GradeHistory gh1 =
        GradeHistory.builder()
            .course("FAKE    123")
            .instructor("CONRAD P T")
            .yyyyq("20252")
            .grade("P")
            .count(7)
            .build();

    GradeHistory gh2 =
        GradeHistory.builder()
            .course("FAKE    123")
            .instructor("CONRAD P T")
            .yyyyq("20252")
            .grade("NP")
            .count(3)
            .build();

    List<GradeHistory> expectedGradeHistoryRecords = List.of(gh1, gh2);

    verify(spy, Mockito.times(1)).flushBuffer(Mockito.eq(expectedGradeHistoryRecords), anyInt());
  }

  @Test
  void test_badDataShouldThrowException() {

    String expectedURL = "https://example.com/grades.csv";
    String expectedResult =
        """
        course,instructor,quarter,year,A,B,C,D,F,nLetterStudents,nPNPStudents,avgGPA,P,dept,S,su,Ap,Bp,Cp,Dp,Am,Bm,Cm,Dm,IP
        This data is just nonsense and should result in an exception
        """;

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

    Job job = Job.builder().build();
    JobContext jobContext = new JobContext(null, job);

    assertThrows(
        RuntimeException.class,
        () -> {
          gradeHistoryImportServiceImpl.importGradesFromUrl(
              "https://example.com/grades.csv", jobContext, 5);
        });
  }

  @Test
  void test_whenExpectedGradeIsNotInDataItIsHandledGracefully() throws Exception {

    String expectedURL = "https://example.com/grades.csv";
    // This data is missing the Dm and IP columns
    String expectedResult =
        """
        course,instructor,quarter,year,A,B,C,D,F,nLetterStudents,nPNPStudents,avgGPA,P,dept,S,su,Ap,Bp,Cp,Dp,Am,Bm,Cm
        CMPSC     5A,CONRAD P T,Spring,2025,50,13,2,1,3,122,0,3.4188524590163936,0,CMPSC,0,0,10,7,2,1,22,6,3
        """;

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

    Job job = Job.builder().build();
    JobContext jobContext = new JobContext(null, job);

    gradeHistoryImportServiceImpl.importGradesFromUrl(
        "https://example.com/grades.csv", jobContext, 5);
  }

  @Test
  void test_whenDataValueIsMissingItIsHandledGracefully() throws Exception {

    String expectedURL = "https://example.com/grades.csv";
    // This data is missing the Dm and IP data values,and the nPNPStudents and P columns
    String expectedResult =
        """
        course,instructor,quarter,year,A,B,C,D,F,nLetterStudents,nPNPStudents,avgGPA,P,dept,S,su,Ap,Bp,Cp,Dp,Am,Bm,Cm,Dm,IP
        CMPSC     5A,CONRAD P T,Spring,2025,50,13,2,1,3,122,,3.4188524590163936,,CMPSC,0,0,10,7,2,1,22,6,3,,
        """;

    this.mockRestServiceServer
        .expect(requestTo(expectedURL))
        .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

    Job job = Job.builder().build();
    JobContext jobContext = new JobContext(null, job);

    gradeHistoryImportServiceImpl.importGradesFromUrl(
        "https://example.com/grades.csv", jobContext, 5);
  }

  @Test
  void test_updateEntity() throws Exception {

    GradeHistory entity =
        GradeHistory.builder()
            .yyyyq("20252")
            .course("FAKE    123")
            .instructor("CONRAD P T")
            .grade("P")
            .count(7)
            .build();

    PreparedStatement ps = mock(PreparedStatement.class);
    gradeHistoryImportServiceImpl.updateEntity(ps, entity);

    verify(ps).setString(1, "20252");
    verify(ps).setString(2, "FAKE    123");
    verify(ps).setString(3, "CONRAD P T");
    verify(ps).setString(4, "P");
    verify(ps).setInt(5, 7);
  }
}
