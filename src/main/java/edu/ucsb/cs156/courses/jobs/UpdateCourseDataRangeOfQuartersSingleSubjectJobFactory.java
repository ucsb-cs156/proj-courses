package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.services.CourseDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UpdateCourseDataRangeOfQuartersSingleSubjectJobFactory {

    @Autowired
    private CourseDataService courseDataService;

    public UpdateCourseDataJob create(String start_quarterYYYYQ, String end_quarterYYYYQ, String subjectArea) {

        return new UpdateCourseDataJob(start_quarterYYYYQ, end_quarterYYYYQ, List.of(subjectArea), courseDataService);
    }
}
