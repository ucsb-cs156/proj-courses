package edu.ucsb.cs156.courses.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;


@Service
public class UpdateCourseDataRangeOfQuartersSingleSubjectJobFactory  {

    @Autowired 
    private UCSBCurriculumService ucsbCurriculumService;

    @Autowired
    private ConvertedSectionCollection convertedSectionCollection;

    public UpdateCourseDataRangeOfQuartersSingleSubjectJob create(String subjectArea, String start_quarterYYYYQ, String end_quarterYYYYQ) {
     
        return new UpdateCourseDataRangeOfQuartersSingleSubjectJob(subjectArea, start_quarterYYYYQ, end_quarterYYYYQ, ucsbCurriculumService, convertedSectionCollection);
    }
}