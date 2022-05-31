package edu.ucsb.cs156.courses.documents;

public class SectionFixtures {
  public static final String SECTION_JSON_CMPSC165B = """
    {
      "quarter": "20224",
      "courseId": "CMPSC   165B ",
      "title": "MACHINE LEARNING",
      "contactHours": 30,
      "description": "Covers the most important techniques of machine learning (ML) and includes discussions of: well-posed learning problems; artificial neural networks; c oncept learning and general to specific ordering; decision tree learning; g enetic algorithms; Bayesian learning; analytical learning; and others.",
      "college": "ENGR",
      "objLevelCode": "U",
      "subjectArea": "CMPSC   ",
      "unitsFixed": 4,
      "unitsVariableHigh": null,
      "unitsVariableLow": null,
      "delayedSectioning": null,
      "inProgressCourse": null,
      "gradingOption": "L",
      "instructionType": "LEC",
      "onLineCourse": false,
      "deptCode": "CMPSC",
      "generalEducation": [],
      "classSections": [
        {
          "enrollCode": "08268",
          "section": "0100",
          "session": null,
          "classClosed": null,
          "courseCancelled": null,
          "gradingOptionCode": null,
          "enrolledTotal": 18,
          "maxEnroll": 125,
          "secondaryStatus": "R",
          "departmentApprovalRequired": false,
          "instructorApprovalRequired": false,
          "restrictionLevel": null,
          "restrictionMajor": "+CMPSC+CMPEN",
          "restrictionMajorPass": null,
          "restrictionMinor": null,
          "restrictionMinorPass": null,
          "concurrentCourses": [],
          "timeLocations": [
            {
              "room": "1006",
              "building": "NH",
              "roomCapacity": 132,
              "days": " T R   ",
              "beginTime": "17:00",
              "endTime": "18:15"
            }
          ],
          "instructors": [
            {
              "instructor": "CHANG SHIYU",
              "functionCode": "Teaching and in charge"
            }
          ]
        }
      ]
    }
      """;

}
  /*pub
    export const oneSection = [
      {
          "courseInfo": {
            "quarter": "20221",
            "courseId": "ECE       1A ",
            "title": "COMP ENGR SEMINAR",
            "description": "Introductory seminar to expose students to a broad range of topics in computer   engineering."
          },
          "section": {
            "enrollCode": "12583",
            "section": "0100",
            "session": null,
            "classClosed": null,
            "courseCancelled": null,
            "gradingOptionCode": null,
            "enrolledTotal": 84,
            "maxEnroll": 100,
            "secondaryStatus": null,
            "departmentApprovalRequired": false,
            "instructorApprovalRequired": false,
            "restrictionLevel": null,
            "restrictionMajor": "+PRCME+CMPEN",
            "restrictionMajorPass": null,
            "restrictionMinor": null,
            "restrictionMinorPass": null,
            "concurrentCourses": [],
            "timeLocations": [
              {
                "room": "1930",
                "building": "BUCHN",
                "roomCapacity": "100",
                "days": "M      ",
                "beginTime": "15:00",
                "endTime": "15:50"
              }
            ],
            "instructors": [
              {
                "instructor": "WANG L C",
                "functionCode": "Teaching and in charge"
              }
            ]
            }
]
*/