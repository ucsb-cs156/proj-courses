import { Container, Row, Col } from "react-bootstrap";
import GenericDropdown from "main/components/Utils/GenericDropdown";
import OurPagination from "main/components/Utils/OurPagination";

const JobsSearchForm = ({
  updateSelectedPage,
  updateSortField,
  updateSortDirection,
  updatePageSize,
  totalPages,
}) => {
  const dropdowns = [
    {
      label: "Sort By",
      values: ["createdBy", "createdAt", "updatedAt", "status"],
      controlId: "JobsSearch.SortField",
      onChange: updateSortField,
    },
    {
      label: "Sort Direction",
      values: ["ASC", "DESC"],
      controlId: "JobsSearch.SortDirection",
      onChange: updateSortDirection,
    },
    {
      label: "Page Size",
      values: ["5", "10", "25", "50", "75", "100"],
      controlId: "JobsSearch.PageSize",
      onChange: updatePageSize,
    },
  ];

  const renderDropdown = ({ label, values, controlId, onChange }) => (
    <Col md="auto" key={controlId}>
      <GenericDropdown
        label={label}
        values={values}
        controlId={controlId}
        setValue={onChange}
      />
    </Col>
  );

  return (
    <Container>
      <Row>{dropdowns.map(renderDropdown)}</Row>
      <OurPagination
        updateActivePage={updateSelectedPage}
        totalPages={totalPages}
      />
    </Container>
  );
};

export default JobsSearchForm;
