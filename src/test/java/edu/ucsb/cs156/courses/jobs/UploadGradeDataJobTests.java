package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import edu.ucsb.cs156.courses.entities.GradeHistory;
import edu.ucsb.cs156.courses.entities.Job;
import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;
import edu.ucsb.cs156.courses.services.UCSBGradeHistoryServiceImpl;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@RestClientTest(UploadGradeDataJob.class)
@AutoConfigureDataJpa
public class UploadGradeDataJobTests {

  @MockBean GradeHistoryRepository gradeHistoryRepository;

  @MockBean UCSBGradeHistoryServiceImpl ucsbGradeHistoryServiceImpl;

  @Test
  public void test_upsertAll() {

    // arrange

    List<GradeHistory> gradeHistoriesToUpsert = new ArrayList<GradeHistory>();
    GradeHistory existingOne =
        GradeHistory.builder()
            .yyyyq("20204")
            .course("CMPSC   156")
            .instructor("CONRAD P")
            .grade("A")
            .count(50)
            .build();
    GradeHistory existingOneUpdated =
        GradeHistory.builder()
            .yyyyq("20204")
            .course("CMPSC   156")
            .instructor("CONRAD P")
            .grade("A")
            .count(51)
            .build();
    GradeHistory newOne =
        GradeHistory.builder()
            .yyyyq("20204")
            .course("CMPSC   148")
            .instructor("HOLLERER T")
            .grade("A")
            .count(50)
            .build();

    gradeHistoriesToUpsert.add(existingOneUpdated);
    gradeHistoriesToUpsert.add(newOne);

    when(gradeHistoryRepository.findByYyyyqAndCourseAndInstructorAndGrade(
            eq("20204"), eq("CMPSC   156"), eq("CONRAD P"), eq("A")))
        .thenReturn(Arrays.asList(existingOne));

    when(gradeHistoryRepository.findByYyyyqAndCourseAndInstructorAndGrade(
            eq("20204"), eq("CMPSC   148"), eq("HOLLERER T"), eq("A")))
        .thenReturn(Arrays.asList());

    when(gradeHistoryRepository.save(eq(existingOneUpdated))).thenReturn(existingOneUpdated);

    when(gradeHistoryRepository.save(eq(newOne))).thenReturn(newOne);

    // act

    List<GradeHistory> result =
        UploadGradeDataJob.upsertAll(gradeHistoryRepository, gradeHistoriesToUpsert);

    // assert

    assertTrue(result.contains(existingOne));
    assertTrue(result.contains(newOne));

    verify(gradeHistoryRepository)
        .findByYyyyqAndCourseAndInstructorAndGrade(
            eq("20204"), eq("CMPSC   156"), eq("CONRAD P"), eq("A"));
    verify(gradeHistoryRepository)
        .findByYyyyqAndCourseAndInstructorAndGrade(
            eq("20204"), eq("CMPSC   148"), eq("HOLLERER T"), eq("A"));
    verify(gradeHistoryRepository).save(existingOneUpdated);
    verify(gradeHistoryRepository).save(newOne);
  }

  @Test
  void test_log_output_success() throws Exception {

    // Arrange

    Job jobStarted = Job.builder().build();
    JobContext ctx = new JobContext(null, jobStarted);

    UploadGradeDataJob uploadGradeDataJob =
        new UploadGradeDataJob(ucsbGradeHistoryServiceImpl, gradeHistoryRepository);

    List<String> mockedListOfUrls = new ArrayList<String>();
    mockedListOfUrls.add(
        "https://raw.githubusercontent.com/ucsb-cs156/UCSB_Grades/main/quarters/F20/CMPSC.csv");
    mockedListOfUrls.add(
        "https://raw.githubusercontent.com/ucsb-cs156/UCSB_Grades/main/quarters/F20/CMPTGCS.csv");
    mockedListOfUrls.add(
        "https://raw.githubusercontent.com/ucsb-cs156/UCSB_Grades/main/quarters/W21/CMPSC.csv");
    mockedListOfUrls.add(
        "https://raw.githubusercontent.com/ucsb-cs156/UCSB_Grades/main/quarters/W21/CMPTGCS.csv");

    List<GradeHistory> gradeHistory_F20_CMPSC = new ArrayList<GradeHistory>();
    gradeHistory_F20_CMPSC.add(
        GradeHistory.builder()
            .yyyyq("20204")
            .course("CMPSC   156")
            .instructor("CONRAD P")
            .grade("A")
            .count(50)
            .build());

    List<GradeHistory> gradeHistory_F20_CMPTGCS = new ArrayList<GradeHistory>();
    gradeHistory_F20_CMPTGCS.add(
        GradeHistory.builder()
            .yyyyq("20204")
            .course("CMPTGCS   1A")
            .instructor("WANG R K")
            .grade("P")
            .count(8)
            .build());

    List<GradeHistory> gradeHistory_W21_CMPSC = new ArrayList<GradeHistory>();
    gradeHistory_W21_CMPSC.add(
        GradeHistory.builder()
            .yyyyq("20211")
            .course("CMPSC   156")
            .instructor("CONRAD P")
            .grade("A")
            .count(50)
            .build());

    List<GradeHistory> gradeHistory_W21_CMPTGCS = new ArrayList<GradeHistory>();
    gradeHistory_W21_CMPTGCS.add(
        GradeHistory.builder()
            .yyyyq("20211")
            .course("CMPTGCS  20")
            .instructor("WANG R K")
            .grade("P")
            .count(8)
            .build());

    when(ucsbGradeHistoryServiceImpl.getUrls()).thenReturn(mockedListOfUrls);
    when(ucsbGradeHistoryServiceImpl.getGradeData(eq(mockedListOfUrls.get(0))))
        .thenReturn(gradeHistory_F20_CMPSC);
    when(ucsbGradeHistoryServiceImpl.getGradeData(eq(mockedListOfUrls.get(1))))
        .thenReturn(gradeHistory_F20_CMPTGCS);
    when(ucsbGradeHistoryServiceImpl.getGradeData(eq(mockedListOfUrls.get(2))))
        .thenReturn(gradeHistory_W21_CMPSC);
    when(ucsbGradeHistoryServiceImpl.getGradeData(eq(mockedListOfUrls.get(3))))
        .thenReturn(gradeHistory_W21_CMPTGCS);

    // Act

    uploadGradeDataJob.accept(ctx);

    // Assert

    String expected =
        """
            Updating UCSB Grade History Data
            Processing data for year: 20204
            Processing data for subjectArea: CMPSC
            Processing data for subjectArea: CMPTGCS
            Processing data for year: 20211
            Processing data for subjectArea: CMPSC
            Processing data for subjectArea: CMPTGCS
            Finished updating UCSB Grade History Data""";

    assertEquals(expected, jobStarted.getLog());
  }
}
