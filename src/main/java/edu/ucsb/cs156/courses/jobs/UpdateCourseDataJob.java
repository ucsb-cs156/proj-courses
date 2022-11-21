package edu.ucsb.cs156.courses.jobs;


import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import lombok.Builder;

@Builder
public class UpdateCourseDataJob implements JobContextConsumer {

    private String subjectArea;
    private String quarterYYYYQ; 

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Updating courses for [" + subjectArea + " " + quarterYYYYQ + "]");
        ctx.log("This is where the code to pull data from the UCSB API would go");
        ctx.log("This is where the code to store that data in MongoDB would go");
        ctx.log("Courses for [" + subjectArea + " " + quarterYYYYQ + "] have been updated");
    }
}