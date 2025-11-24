import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { allBuildings } from "fixtures/buildingFixtures";
import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleBuildingDropdown from "../Buildings/SingleBuildingDropdown";
import GenericDropdown from "../Utils/GenericDropdown";

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
  const localClassroom = localStorage.getItem(
    "CourseOverTimeBuildingsSearch.Classroom",
  );

  const [Quarter, setQuarter] = useState(
    localQuarter || availableQuarters[0].yyyyq,
  );
  const [buildingCode, setBuildingCode] = useState(localBuildingCode || "");
  const [availableClassrooms, setAvailableClassrooms] = useState([]);
  const [classroom, setClassroom] = useState(localClassroom || "ALL");

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
          const classrooms = response.data.sort();

          setAvailableClassrooms(classrooms);
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
          <Col md="auto">
            {availableClassrooms.length > 0 && (
              <GenericDropdown
                values={["ALL", ...availableClassrooms]}
                setValue={setClassroom}
                controlId={"CourseOverTimeBuildingsSearch.Classroom"}
                label={"Classroom"}
              />
            )}
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
