package edu.ucsb.cs156.example.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import edu.ucsb.cs156.example.entities.UCSBSubject;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("UCSBSubjects")
public class UCSBSubjectsService {

    public List<UCSBSubject> get() {

        // TODO: Replace with a service that will call the UCSB
        // developer API at the endpoint
        // https://api.ucsb.edu/students/lookups/v1/subjects?includeInactive=false
        // convert the JSON to a List<UCSBSubjects> object
        // return that object.

        UCSBSubject us1 = UCSBSubject.builder()
                .subjectCode("ANTH")
                .subjectTranslation("Anthropology")
                .deptCode("ANTH")
                .collegeCode("L&S")
                .relatedDeptCode(null)
                .inactive(false)
                .build();

        UCSBSubject us2 = UCSBSubject.builder()
                .subjectCode("ART  CS")
                .subjectTranslation("Art (Creative Studies)")
                .deptCode("CRSTU")
                .collegeCode("CRST")
                .relatedDeptCode(null)
                .inactive(false)
                .build();

        UCSBSubject us3 = UCSBSubject.builder()
                .subjectCode("CH E")
                .subjectTranslation("Chemical Engineering")
                .deptCode("CNENG")
                .collegeCode("ENGR")
                .relatedDeptCode(null)
                .inactive(false)
                .build();

        List<UCSBSubject> temporaryFakeList = new ArrayList<>();
        temporaryFakeList.addAll(Arrays.asList(us1, us2, us3));
        log.info("temporaryFakeList={}",temporaryFakeList);
        return temporaryFakeList;
    }

}
