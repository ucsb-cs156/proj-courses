package edu.ucsb.cs156.courses.jobs;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.courses.services.CourseDataService;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.UCSBSubjectsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@Slf4j
public class UpdateCourseDataWithQuarterJobFactory {


    @Autowired
    private UCSBSubjectRepository subjectRepository;

    @Autowired
    private CourseDataService courseDataService;

    public UpdateCourseDataJob create(String quarterYYYYQ) {
        var subjects = subjectRepository.findAll();
        var subjectCodes = new ArrayList<String>();
        for(var subject : subjects) {
            subjectCodes.add(subject.getSubjectCode());
        }
        return new UpdateCourseDataJob(quarterYYYYQ, quarterYYYYQ, subjectCodes, courseDataService);
    }
}
