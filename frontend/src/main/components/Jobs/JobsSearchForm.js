import useLocalStorage from "main/utils/useLocalStorage";
import { Container, Row, Col } from "react-bootstrap";
import GenericDropdown from "main/components/Utils/GenericDropdown";

const JobsSearchForm = ({
  updateSortField,
  updateSortDirection,
  updatePageSize,
}) => {
  // Stryker disable all ; testing for specific hard coded lists is just writing the code twice
  const sortFields = ["status", "createdAt", "updatedAt"];
  const sortDirections = ["ASC", "DESC"];
  const pageSizes = ["5", "10", "20", "50", "100", "200", "500"];
  // Stryker restore all

  const [sortField, setSortField] = useLocalStorage(
    "JobsSearch.SortField",
    sortFields[0]
  );
  const [sortDirection, setSortDirection] = useLocalStorage(
    "JobsSearch.SortDirection",
    sortDirections[0]
  );
  const [pageSize, setPageSize] = useLocalStorage(
    "JobsSearch.PageSize",
    pageSizes[0]
  );

  const doUpdateSortField = (value) => {
    setSortField(value);
    updateSortField(value);
  };

  const doUpdateSortDirection = (value) => {
    setSortDirection(value);
    updateSortDirection(value);
  };

  const doUpdatePageSize = (value) => {
    setPageSize(value);
    updatePageSize(value);
  };

  return (
    <Container>
      <Row>
        <Col md="auto">
          <GenericDropdown
            values={sortFields}
            value={sortField}
            setValue={doUpdateSortField}
            controlId={"JobsSearch.SortField"}
            label="Sort By"
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={sortDirections}
            value={sortDirection}
            setValue={doUpdateSortDirection}
            controlId={"JobsSearch.SortDirection"}
            label="Sort Direction"
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={pageSizes}
            value={pageSize}
            setValue={doUpdatePageSize}
            controlId={"JobsSearch.PageSize"}
            label="Page Size"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default JobsSearchForm;