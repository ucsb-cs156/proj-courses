package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.entities.UCSBSubject;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.courses.services.CourseDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@Slf4j
public class UpdateCourseDataRangeOfQuartersJobFactory {

    @Autowired
    private CourseDataService courseDataService;

    @Autowired
    private UCSBSubjectRepository subjectRepository;

    public UpdateCourseDataJob create(String start_quarterYYYYQ, String end_quarterYYYYQ) {
        List<String> subjects = new ArrayList();
        for (var UCSBSubject : subjectRepository.findAll()) {
            subjects.add(UCSBSubject.getSubjectCode());
        }
        return new UpdateCourseDataJob(start_quarterYYYYQ, end_quarterYYYYQ, subjects, courseDataService);
    }
}
