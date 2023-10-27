package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.entities.UCSBSubject;
import edu.ucsb.cs156.courses.services.CourseDataService;
import edu.ucsb.cs156.courses.services.UCSBSubjectsService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.List;


@AllArgsConstructor
@Slf4j
public class UpdateCourseDataWithQuarterJob implements JobContextConsumer {

    @Getter
    private String quarterYYYYQ;
    @Getter
    private UCSBSubjectsService ucsbSubjectService;
    @Getter
    private CourseDataService courseDataService;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Updating quarter courses for [" + quarterYYYYQ + "]");

        List<UCSBSubject> ucsbsubjects = ucsbSubjectService.get();
        for (UCSBSubject subject : ucsbsubjects) {
            String subjectArea = subject.getSubjectCode();

            courseDataService.updateCourses(
                ctx,
                quarterYYYYQ,
                subjectArea
            );
        }
    }
}
