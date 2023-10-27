package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.services.jobs.JobContext;
import org.springframework.stereotype.Service;

@Service
public interface CourseDataService {
    void updateCourses(
        JobContext ctx,
        String quarterYYYYQ,
        String subjectArea
    ) throws Exception;
}
