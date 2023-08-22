package edu.ucsb.cs156.courses.jobs;

import java.util.ArrayList;
import java.util.List;

import edu.ucsb.cs156.courses.entities.GradeHistory;
import edu.ucsb.cs156.courses.repositories.GradeHistoryRepository;

import edu.ucsb.cs156.courses.services.UCSBGradeHistoryService;
import edu.ucsb.cs156.courses.services.UCSBGradeHistoryServiceImpl;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.Optional;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
public class UploadGradeDataJob implements JobContextConsumer {
    @Getter
    private UCSBGradeHistoryServiceImpl ucsbGradeHistoryServiceImpl;
    @Getter
    private GradeHistoryRepository gradeHistoryRepository;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Updating UCSB Grade History Data");
        List<String> urls = ucsbGradeHistoryServiceImpl.getUrls();
        GradeHistory previous = new GradeHistory();
        List<GradeHistory> results = null;
        for (String url : urls) {
            results = ucsbGradeHistoryServiceImpl.getGradeData(url);
            GradeHistory topRow = results.get(0);
            upsertAll(gradeHistoryRepository, results);
            logProgress(ctx, topRow, previous);
        }

        ctx.log("Finished updating UCSB Grade History Data");
    }

    private void logProgress(JobContext ctx, GradeHistory topRow, GradeHistory previous) {
        if (!topRow.getYyyyq().equals(previous.getYyyyq())) {
            ctx.log("Processing data for year: " + topRow.getYyyyq());
            previous.setYyyyq(topRow.getYyyyq());
        }
        ctx.log("Processing data for subjectArea: " + topRow.getSubjectArea());
    }

    public static List<GradeHistory> upsertAll(
            GradeHistoryRepository gradeHistoryRepository,
            List<GradeHistory> gradeHistories){
        List<GradeHistory> result = new ArrayList<GradeHistory>();
        for (GradeHistory gradeHistory : gradeHistories) {
            List<GradeHistory> query = gradeHistoryRepository.findByYyyyqAndCourseAndInstructorAndGrade(
                    gradeHistory.getYyyyq(), gradeHistory.getCourse(), gradeHistory.getInstructor(),
                    gradeHistory.getGrade());
            if (query.size() == 0) {
                gradeHistoryRepository.save(gradeHistory);
                result.add(gradeHistory);
            } else {
                GradeHistory existing = query.get(0);
                existing.setCount(gradeHistory.getCount());
                existing = gradeHistoryRepository.save(existing);
                result.add(existing);
            }
        }
        return result;
    }
}