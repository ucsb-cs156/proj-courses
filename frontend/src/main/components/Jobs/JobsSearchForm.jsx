import { Container, Row, Col } from "react-bootstrap";
import GenericDropdown from "main/components/Utils/GenericDropdown";

const JobsSearchForm = ({
  updateSortField,
  updateSortDirection,
  updatePageSize,
}) => {
  // Stryker disable all ; testing for specific hard coded lists is just writing the code twice
  const sortFields = ["status", "createdAt"];
  const sortDirections = ["ASC", "DESC"];
  const pageSizes = ["10", "50", "100", "200", "500"];
  // Stryker restore all

  return (
    <Container>
      <Row>
        <Col md="auto">
          <GenericDropdown
            values={sortFields}
            setValue={updateSortField}
            controlId={"JobsSearch.SortField"}
            label="Sort By"
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={sortDirections}
            setValue={updateSortDirection}
            controlId={"JobsSearch.SortDirection"}
            label="Sort Direction"
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={pageSizes}
            setValue={updatePageSize}
            controlId={"JobsSearch.PageSize"}
            label="Page Size"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default JobsSearchForm;
