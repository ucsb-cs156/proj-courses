import { Container, Row, Col } from "react-bootstrap";
import GenericDropdown from "main/components/Utils/GenericDropdown";

const JobsSearchForm = ({
  sortField,
  sortDirection,
  pageSize,
  updateSortField,
  updateSortDirection,
  updatePageSize,
}) => {
  // Stryker disable all ; testing for specific hard coded lists is just writing the code twice
  const sortFields = ["id", "status", "createdAt", "updatedAt"];
  const sortDirections = ["ASC", "DESC"];
  const pageSizes = ["10", , "25", "50", "100", "250", "500", "1000"];
  // Stryker restore all

  return (
    <Container>
      <Row>
        <Col md="auto">
          <GenericDropdown
            values={sortFields}
            value={sortField}
            setValue={updateSortField}
            controlId={"JobsSearch.SortField"}
            label="Sort By"
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={sortDirections}
            value={sortDirection}
            setValue={updateSortDirection}
            controlId={"JobsSearch.SortDirection"}
            label="Sort Direction"
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={pageSizes}
            value={pageSize}
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