package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.models.Quarter;
import edu.ucsb.cs156.courses.services.CourseDataService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.List;


@AllArgsConstructor
@Slf4j
public class UpdateCourseDataJob implements JobContextConsumer {
    @Getter
    private String start_quarterYYYYQ;
    @Getter
    private String end_quarterYYYYQ;
    @Getter
    private List<String> subjects;
    @Getter
    private CourseDataService courseDataService;

    @Override
    public void accept(JobContext ctx) throws Exception {
        List<Quarter> quarters = Quarter.quarterList(start_quarterYYYYQ, end_quarterYYYYQ);
        for (Quarter quarter : quarters) {
            String quarterYYYYQ = quarter.getYYYYQ();
            for (String subjectArea : subjects) {
                courseDataService.updateCourses(ctx, quarterYYYYQ, subjectArea);
            }
        }
    }
}
