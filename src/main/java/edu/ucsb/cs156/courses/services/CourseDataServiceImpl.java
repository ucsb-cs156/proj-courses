package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Getter
@Service
public class CourseDataServiceImpl implements CourseDataService {
    @Autowired
    private UCSBCurriculumService ucsbCurriculumService;
    @Autowired
    private ConvertedSectionCollection convertedSectionCollection;

    @Override
    public void updateCourses(JobContext ctx, String quarterYYYYQ, String subjectArea) throws Exception {
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
                String qtr = section.getCourseInfo().getQuarter();
                String enrollCode = section.getSection().getEnrollCode();
                Optional<ConvertedSection> optionalSection = convertedSectionCollection
                    .findOneByQuarterAndEnrollCode(qtr, enrollCode);
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
