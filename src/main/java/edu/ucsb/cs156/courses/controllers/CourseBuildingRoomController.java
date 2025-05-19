package edu.ucsb.cs156.courses.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import java.util.ArrayList; 
import java.util.Set;
import java.util.HashSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/coursebuildingroom")
public class CourseBuildingRoomController {

  private ObjectMapper mapper = new ObjectMapper();

  @Autowired ConvertedSectionCollection convertedSectionCollection;

@Operation(summary = "Get a list of classroom numbers from a building for a specified quarter")
@GetMapping(value = "/buildingsearch", produces = "application/json")
public ResponseEntity<String> search(
    @Parameter(
            name = "targetQtr",
            description =
                "Quarter in yyyyq format, e.g. 20231 for W23, 20232 for S23, etc. (1=Winter, 2=Spring, 3=Summer, 4=Fall)",
            example = "20231",
            required = true)
        @RequestParam
        String targetQtr,

    @Parameter(
            name = "buildingCode",
            description = "Building code such as PHELP for Phelps, GIRV for Girvetz",
            example = "GIRV",
            required = true)
        @RequestParam
        String buildingCode)
    throws JsonProcessingException {

    // Fetch courses for the specified quarter and building
    List<ConvertedSection> courseResults = 
        convertedSectionCollection.findByQuarterAndBuildingCode(
            targetQtr, buildingCode);

    // Use a Set to ensure unique room numbers
    Set<String> classroomNumbers = new HashSet<>();

    // Iterate over each course and its timeLocations
    for (ConvertedSection course : courseResults) {
        // Iterate over the timeLocation array of each section
        for (edu.ucsb.cs156.courses.documents.TimeLocation timeLocation : course.getSection().getTimeLocations()) {
            String room = timeLocation.getRoom();  // Assuming `getRoom()` fetches the room number from timeLocation
            if (room != null && !room.isEmpty()) {
                classroomNumbers.add(room);  // Add room to the set, automatically ensuring uniqueness
            }
        }
    }

    // Convert the set of unique classroom numbers to a list (if you need to output as a list)
    List<String> uniqueClassrooms = new ArrayList<>(classroomNumbers);

    // Convert the classroom numbers list to JSON
    String body = mapper.writeValueAsString(uniqueClassrooms);
    return ResponseEntity.ok().body(body);
}

}
