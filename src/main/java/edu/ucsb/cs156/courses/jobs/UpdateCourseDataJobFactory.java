package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.services.CourseDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class UpdateCourseDataJobFactory {

    @Autowired
    private CourseDataService courseDataService;

    public UpdateCourseDataJob create(String subjectArea, String quarterYYYYQ) {
        return new UpdateCourseDataJob(quarterYYYYQ, quarterYYYYQ, List.of(subjectArea), courseDataService);
    }
}
