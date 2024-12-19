import useLocalStorage from "main/utils/useLocalStorage";
import { Container, Row, Col } from "react-bootstrap";
import { quarterRange } from "main/utils/quarterUtilities";
import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "main/components/Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "main/components/Subjects/SingleSubjectDropdown";
import GenericDropdown from "main/components/Utils/GenericDropdown";
import { useBackend } from "main/utils/useBackend";

const UpdatesSearchForm = ({
  updateQuarter,
  updateSubjectArea,
  updateSortField,
  updateSortDirection,
  updatePageSize,
}) => {
  const { data: systemInfo } = useSystemInfo();

  // Stryker disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";
  // Stryker enable OptionalChaining

  const quarters = quarterRange(startQtr, endQtr);

  const {
    data: subjects,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/UCSBSubjects/all"],
    // Stryker disable next-line StringLiteral : equivalent mutation, GET is equivalent to "" (default)
    { method: "GET", url: "/api/UCSBSubjects/all" },
    [],
  );

  // Stryker disable all ; testing for specific hard coded lists is just writing the code twice
  const sortFields = ["subjectArea", "quarter", "lastUpdate"];
  const sortDirections = ["ASC", "DESC"];
  const pageSizes = ["10", "50", "100", "200", "500"];
  // Stryker restore all

  const [quarter, setQuarter] = useLocalStorage("UpdatesSearch.SubjectArea", "ALL");
  const [subjectArea, setSubjectArea] = useLocalStorage("UpdatesSearch.Quarter", "ALL");

  const doUpdateQuarter = (q) => {
    setQuarter(q);
    updateQuarter(q);
  };

  const doUpdateSubjectArea = (s) => {
    setSubjectArea(s);
    updateSubjectArea(s);
  };

  return (
    <Container>
      <Row>
        <Col md="auto">
          <SingleQuarterDropdown
            quarters={quarters}
            quarter={quarter}
            setQuarter={doUpdateQuarter}
            controlId={"UpdatesSearch.Quarter"}
            showAll={true}
          />
        </Col>
        <Col md="auto">
          <SingleSubjectDropdown
            subjects={subjects}
            subject={subjectArea}
            setSubject={doUpdateSubjectArea}
            controlId={"UpdatesSearch.SubjectArea"}
            showAll={true}
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={sortFields}
            setValue={updateSortField}
            controlId={"UpdatesSearch.SortField"}
            label="Sort By"
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={sortDirections}
            setValue={updateSortDirection}
            controlId={"UpdatesSearch.SortDirection"}
            label="Sort Direction"
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={pageSizes}
            setValue={updatePageSize}
            controlId={"UpdatesSearch.PageSize"}
            label="Page Size"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default UpdatesSearchForm;
