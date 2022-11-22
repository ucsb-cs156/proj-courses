package edu.ucsb.cs156.courses.jobs;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateCourseDataJob implements JobContextConsumer {

    private String subjectArea;
    private String quarterYYYYQ; 
    private UCSBCurriculumService ucsbCurriculumService;
    private ConvertedSectionCollection convertedSectionCollection;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Updating courses for [" + subjectArea + " " + quarterYYYYQ + "]");
       
        List<ConvertedSection> convertedSections = ucsbCurriculumService.getConvertedSections(subjectArea,  quarterYYYYQ, "A");

        ctx.log("Found " + convertedSections.size() + " sections");
        ctx.log("Storing in MongoDB Collection...");

        List<ConvertedSection> saved = convertedSectionCollection.saveAll(convertedSections);

        ctx.log(saved.size() + " sections saved in MongoDB Collection...");

        ctx.log("Courses for [" + subjectArea + " " + quarterYYYYQ + "] have been updated");
    }
}