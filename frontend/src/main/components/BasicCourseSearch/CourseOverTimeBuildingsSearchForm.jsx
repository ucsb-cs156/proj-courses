import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { allBuildings } from "fixtures/buildingFixtures";
import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleBuildingDropdown from "../Buildings/SingleBuildingDropdown";

const CourseOverTimeBuildingsSearchForm = ({ fetchJSON }) => {
  const { data: systemInfo } = useSystemInfo();

  // stryker-disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ ?? "20232";
  const endQtr = systemInfo?.endQtrYYYYQ ?? "20254";
  // stryker-enable OptionalChaining
  const availableQuarters = quarterRange(startQtr, endQtr);

  const localQuarter = localStorage.getItem(
    "CourseOverTimeBuildingsSearch.Quarter",
  );
  const localBuildingCode = localStorage.getItem(
    "CourseOverTimeBuildingsSearch.BuildingCode",
  );

  const [Quarter, setQuarter] = useState(
    localQuarter || availableQuarters[0].yyyyq,
  );
  const [buildingCode, setBuildingCode] = useState(localBuildingCode || "");
  const [availableClassrooms, setAvailableClassrooms] = useState([]);
  const [classroom, setClassroom] = useState("ALL");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { Quarter, buildingCode, classroom });
  };

  useEffect(() => {
    async function fetchClassrooms() {
      if (Quarter && buildingCode) {
        try {
          console.log("Fetching classrooms with:", { Quarter, buildingCode });
          const response = await axios.get(
            "/api/public/courseovertime/buildingsearch/classrooms",
            {
              params: { quarter: Quarter, buildingCode },
            },
          );
          console.log("Classrooms returned:", response.data);
          const classrooms = response.data;

          setAvailableClassrooms(classrooms);
          //not setting classroom to ALL because redundent when default value is ALL
        } catch (error) {
          console.error("Error fetching classrooms", error);
          setAvailableClassrooms([]);
        }
      }
    }
    fetchClassrooms();
  }, [Quarter, buildingCode]);

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={availableQuarters}
              quarter={Quarter}
              setQuarter={setQuarter}
              controlId={"CourseOverTimeBuildingsSearch.Quarter"}
              label={"Quarter"}
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
        </Row>

        <Row style={{ paddingTop: 10 }}>
          <Col md="auto">
            <Form.Group controlId="CourseOverTimeBuildingsSearch.Classroom">
              <Form.Label>Classroom</Form.Label>
              <Form.Select
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                disabled={availableClassrooms.length === 0}
                data-testid="CourseOverTimeBuildingsSearch.ClassroomSelect"
              >
                {/* ALL at the top */}
                <option value="ALL">ALL</option>
                {availableClassrooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
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
