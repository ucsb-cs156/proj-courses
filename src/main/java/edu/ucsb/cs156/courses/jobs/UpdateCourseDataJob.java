package edu.ucsb.cs156.courses.jobs;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mongodb.WriteError;
import com.mongodb.client.model.Filters;
import com.mongodb.client.result.UpdateResult;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;



import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Getter;


@AllArgsConstructor
public class UpdateCourseDataJob implements JobContextConsumer {

    @Getter private String subjectArea;
    @Getter private String quarterYYYYQ;
    @Getter private UCSBCurriculumService ucsbCurriculumService;
    @Getter private ConvertedSectionCollection convertedSectionCollection;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Updating courses for [" + subjectArea + " " + quarterYYYYQ + "]");

        List<ConvertedSection> convertedSections = ucsbCurriculumService.getConvertedSections(subjectArea, quarterYYYYQ,
                "A");

        ctx.log("Found " + convertedSections.size() + " sections");
        ctx.log("Storing in MongoDB Collection...");

        int newSections = 0;
        int updatedSections = 0;
        int errors = 0;

        for (ConvertedSection section : convertedSections) {
            try {
                Optional<ConvertedSection> optionalSection = convertedSectionCollection
                        .findOneByQuarterAndEnrollCode(section.getCourseInfo().getQuarter(), section.getSection().getEnrollCode());
                if (optionalSection.isPresent()) {
                    ConvertedSection existingSection = optionalSection.get();
                    existingSection.setCourseInfo(section.getCourseInfo());
                    existingSection.setSection(section.getSection());
                    convertedSectionCollection.save(existingSection);
                    updatedSections++;
                } else {
                    convertedSectionCollection.save(section);
                    newSections++;
                }
            } catch (Exception e) {
                ctx.log("Error saving section: " + e.getMessage());
                errors++;
            }
        }
    
        ctx.log(String.format("%d new sections saved, %d sections updated, %d errors", newSections, updatedSections,
                errors));
        ctx.log("Courses for [" + subjectArea + " " + quarterYYYYQ + "] have been updated");
    }
}