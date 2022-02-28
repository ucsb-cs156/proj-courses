package edu.ucsb.cs156.example.services;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBSubject;


class UCSBSubjectsServiceTests extends ControllerTestCase {

  
  UCSBSubjectsService ucsbSubjectsService = new UCSBSubjectsService();

  @Test
  void get_returns_a_list_of_subjects() {
    // This is a temporary test case for the temporary code


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
    assertEquals(temporaryFakeList, ucsbSubjectsService.get());

  }

}
