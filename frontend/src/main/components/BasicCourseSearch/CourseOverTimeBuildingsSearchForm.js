import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { allBuildings } from "fixtures/buildingFixtures";
import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleBuildingDropdown from "../Buildings/SingleBuildingDropdown";
import SingleClassroomDropdown from "../Classrooms/SingleClassroomDropdown";

const CourseOverTimeBuildingsSearchForm = ({ fetchJSON }) => {
  const { data: systemInfo } = useSystemInfo();

  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";

  const quarters = quarterRange(startQtr, endQtr);

  const localStartQuarter = localStorage.getItem(
    "CourseOverTimeBuildingsSearch.StartQuarter",
  );
  const localEndQuarter = localStorage.getItem(
    "CourseOverTimeBuildingsSearch.EndQuarter",
  );
  const localBuildingCode = localStorage.getItem(
    "CourseOverTimeBuildingsSearch.BuildingCode",
  );

  const [startQuarter, setStartQuarter] = useState(
    localStartQuarter || quarters[0].yyyyq,
  );
  const [endQuarter, setEndQuarter] = useState(
    localEndQuarter || quarters[0].yyyyq,
  );
  const [buildingCode, setBuildingCode] = useState(localBuildingCode || "");
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [classroom, setClassroom] = useState("");

  useEffect(() => {
    const fetchClassrooms = async () => {
      if (!buildingCode) return;
      try {
        const url = `/api/public/courseovertime/classrooms?startQtr=${startQuarter}&endQtr=${endQuarter}&buildingCode=${buildingCode}`;
        const response = await fetch(url);
        const rooms = await response.json();
        setAllClassrooms(
          rooms.map((room) => ({
            buildingCode,
            roomNumber: room,
          })),
        );
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };
    fetchClassrooms();
  }, [buildingCode, startQuarter, endQuarter]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { startQuarter, endQuarter, buildingCode, classroom });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={startQuarter}
              setQuarter={setStartQuarter}
              controlId={"CourseOverTimeBuildingsSearch.StartQuarter"}
              label={"Start Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={endQuarter}
              setQuarter={setEndQuarter}
              controlId={"CourseOverTimeBuildingsSearch.EndQuarter"}
              label={"End Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleBuildingDropdown
              buildings={allBuildings}
              building={buildingCode}
              setBuilding={setBuildingCode}
              controlId={"CourseOverTimeBuildingsSearch.BuildingCode"}
              label={"Building Name"}
            />
          </Col>
          mv
          <Col md="auto">
            <SingleClassroomDropdown
              building={buildingCode}
              classrooms={allClassrooms}
              classroom={classroom}
              setClassroom={setClassroom}
              controlId="CourseOverTimeBuildingsSearch.Classroom"
              label="Classroom"
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Col md="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default CourseOverTimeBuildingsSearchForm;
