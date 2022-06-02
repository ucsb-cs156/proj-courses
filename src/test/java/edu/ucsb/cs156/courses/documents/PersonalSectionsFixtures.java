package edu.ucsb.cs156.courses.documents;

public class PersonalSectionsFixtures {
  public static final String ONE_COURSE = """
    {
    "quarter": "20221",
    "courseId": "ARTHI     5B ",
    "title": "INTRO MUSEUM STUDY",
    "description": "Designed to introduce students to various aspects of Museum   Studies- historical, theoretical, and practical- by examining   a range of issues and topics with which the field is engaged.",
    "classSections": [
      {
        "enrollCode": "59501",
        "section": "0100",
        "session": null,
        "classClosed": "Y",
        "courseCancelled": null,
        "gradingOptionCode": null,
        "enrolledTotal": 94,
        "maxEnroll": 95,
        "secondaryStatus": "R",
        "departmentApprovalRequired": false,
        "instructorApprovalRequired": false,
        "restrictionLevel": null,
        "restrictionMajor": null,
        "restrictionMajorPass": null,
        "restrictionMinor": null,
        "restrictionMinorPass": null,
        "concurrentCourses": [],
        "timeLocations": [
          {
            "room": "1174",
            "building": "HSSB",
            "roomCapacity": "95",
            "days": " T R   ",
            "beginTime": "12:30",
            "endTime": "13:45"
          }
        ],
        "instructors": [
          {
            "instructor": "PAUL C",
            "functionCode": "Teaching and in charge"
          }
        ]
      }
    ],
    "generalEducation": [
      {
        "geCode": "F  ",
        "geCollege": "L&S "
      },
      {
        "geCode": "F  ",
        "geCollege": "ENGR"
      }
    ],
    "finalExam": null
  }
      """;

}