import { Container, Row, Col } from "react-bootstrap";
import GenericDropdown from "main/components/Utils/GenericDropdown";
import OurPagination from "../Utils/OurPagination";

const JobsSearchForm = ({
  updateSelectedPage,
  updateSortField,
  updateSortDirection,
  updatePageSize,
  totalPages,
}) => {
  // Stryker disable all ; testing for specific hard coded lists is just writing the code twice
  const sortFields = ["createdAt", "updatedAt", "status"];
  const sortDirections = ["ASC", "DESC"];
  const pageSizes = ["5", "10", "50", "100"];
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
      <OurPagination
        updateActivePage={updateSelectedPage}
        totalPages={totalPages}
      />
    </Container>
  );
};

export default JobsSearchForm;
