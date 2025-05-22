import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import PersonalSchedulesTable from "main/components/PersonalSchedules/PersonalSchedulesTable";
import PersonalSectionsTable from "main/components/PersonalSections/PersonalSectionsTable";
import PersonalSchedulesWeeklyView from "main/components/PersonalSchedulesWeeklyView/PersonalSchedulesWeeklyViewPanel"
import { useBackend, _useBackendMutation } from "main/utils/useBackend";
import { Button } from "react-bootstrap";
import { useCurrentUser } from "main/utils/currentUser";

export default function PersonalSchedulesDetailsPage() {
  let { id } = useParams();
  const { data: currentUser } = useCurrentUser();

  const {
    data: personalSchedule,
    _error,
    _status,
  } = useBackend(
    // Stryker disable all : hard to test for query caching
    [`/api/personalschedules?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/personalschedules?id=${id}`,
      params: {
        id,
      },
    },
  );
  const createButton = () => {
    return (
      <Button variant="primary" href="/personalschedules/list" style={{}}>
        Back
      </Button>
    );
  };

  const { data: personalSection } = useBackend(
    // Stryker disable all : hard to test for query caching
    [`/api/personalSections/all?psId=${id}`],
    {
      method: "GET",
      url: `/api/personalSections/all?psId=${id}`,
      params: {
        id,
      },
    },
  );

  const dayParser = (dayString) => {
    dayString.replaceAll(" ", "");
    const dayArray = [];
    for(let i = 0; i < dayString.length; i++) {
      if(dayString[i] === "M") {
        dayArray.push("Monday");
      }
      else if(dayString[i] === "T") {
        dayArray.push("Tuesday");
      }
      else if(dayString[i] === "W") {
        dayArray.push("Wednesday");
      }
      else if(dayString[i] === "R") {
        dayArray.push("Thursday");
      }
      else if(dayString[i] === "F") {
        dayArray.push("Friday");
      }
    }
    return dayArray;
  }

  const eventParser = () => {
    if(personalSection !== undefined) {
      return {
        event: 
          personalSection
            .filter(section => section.classSections[0].timeLocations[0] !== undefined)
            .map(section => ({
              id: section.classSections[0].enrollCode.trim(),
              title: section.courseId.replaceAll(" ", ""),
              day: dayParser(section.classSections[0].timeLocations[0].days),
              name: section.title,
              description: section.description,
              area: section.classSections[0].timeLocations[0].building.trim() + " " + section.classSections[0].timeLocations[0].room.trim(),
              startTime: section.classSections[0].timeLocations[0].beginTime,
              endTime: section.classSections[0].timeLocations[0].endTime,
          })),
      }
    }
    return {}
  }
  console.log(eventParser());
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Personal Schedules Details</h1>
        {personalSchedule && (
          <PersonalSchedulesTable
            personalSchedules={[personalSchedule]}
            showButtons={false}
          />
        )}
        <p>
          <h2>Sections in Personal Schedule</h2>
          {personalSection && (
            <PersonalSectionsTable
              personalSections={personalSection}
              psId={id}
              currentUser={currentUser}
            />
          )}
        </p>
        <p>
          {personalSection && (
            <PersonalSchedulesWeeklyView Events={eventParser().event} />
          )}
        </p>
        {createButton()}
      </div>
    </BasicLayout>
  );
}
