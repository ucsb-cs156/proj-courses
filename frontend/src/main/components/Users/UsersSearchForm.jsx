import { Container, Row, Col } from "react-bootstrap";
import GenericDropdown from "main/components/Utils/GenericDropdown";

const UsersSearchForm = ({
  updateSortField,
  updateSortDirection,
  updatePageSize,
}) => {
  // Stryker disable all ; testing for specific hard coded lists is just writing the code twice
  const sortFields = ["email", "givenName", "familyName"];
  const sortDirections = ["ASC", "DESC"];
  const pageSizes = ["10", "25", "50", "100", "500"];
  // Stryker restore all

  return (
    <Container>
      <Row>
        <Col md="auto">
          <GenericDropdown
            values={sortFields}
            setValue={updateSortField}
            controlId={"UsersSearch.SortField"}
            label="Sort By"
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={sortDirections}
            setValue={updateSortDirection}
            controlId={"UsersSearch.SortDirection"}
            label="Sort Direction"
          />
        </Col>
        <Col md="auto">
          <GenericDropdown
            values={pageSizes}
            setValue={updatePageSize}
            controlId={"UsersSearch.PageSize"}
            label="Page Size"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default UsersSearchForm;
