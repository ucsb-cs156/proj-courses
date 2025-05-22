import React, { useState } from "react";
import { Pagination } from "react-bootstrap";

export const emptyArray = () => []; // factored out for Stryker testing

const OurPagination = ({
  updateActivePage,
  totalPages = 10,
  testId = "OurPagination",
}) => {
  const [activePage, setActivePage] = useState(1);
  const nextPage = () => {
    const newPage = Math.min(activePage + 1, totalPages);
    setActivePage(newPage);
    updateActivePage(newPage);
  };
  const prevPage = () => {
    const newPage = Math.max(activePage - 1, 1);
    setActivePage(newPage);
    updateActivePage(newPage);
  };
  const thisPage = (page) => {
    setActivePage(page);
    updateActivePage(page);
  };

  const pageButton = (number) => (
    <Pagination.Item
      key={number}
      active={number === activePage}
      onClick={() => thisPage(number)}
      data-testid={`${testId}-${number}`}
    >
      {number}
    </Pagination.Item>
  );

  const generateSimplePaginationItems = () => {
    const paginationItems = emptyArray();
    for (let number = 1; number <= totalPages; number++) {
      paginationItems.push(pageButton(number));
    }
    return paginationItems;
  };

  const generateComplexPaginationItems = () => {
    const paginationItems = emptyArray();

    // Always show page 1 and totalPages
    paginationItems.push(pageButton(1));

    // Case 1: activePage is near the beginning (1, 2, 3, 4)
    if (activePage < 5) {
      paginationItems.push(pageButton(2));
      paginationItems.push(pageButton(3));
      paginationItems.push(pageButton(4));
      paginationItems.push(pageButton(5));
      paginationItems.push(
        <Pagination.Ellipsis
          key="right-ellipsis"
          data-testid={`${testId}-right-ellipsis`}
        />,
      );
    }
    // Case 2: activePage is near the end (totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    else if (activePage > totalPages - 4) {
      paginationItems.push(
        <Pagination.Ellipsis
          key="left-ellipsis"
          data-testid={`${testId}-left-ellipsis`}
        />,
      );
      paginationItems.push(pageButton(totalPages - 4));
      paginationItems.push(pageButton(totalPages - 3));
      paginationItems.push(pageButton(totalPages - 2));
      paginationItems.push(pageButton(totalPages - 1));
    }
    // Case 3: activePage is in the middle
    else {
      paginationItems.push(
        <Pagination.Ellipsis
          key="left-ellipsis"
          data-testid={`${testId}-left-ellipsis`}
        />,
      );
      paginationItems.push(pageButton(activePage - 1));
      paginationItems.push(pageButton(activePage));
      paginationItems.push(pageButton(activePage + 1));
      paginationItems.push(
        <Pagination.Ellipsis
          key="right-ellipsis"
          data-testid={`${testId}-right-ellipsis`}
        />,
      );
    }

    paginationItems.push(pageButton(totalPages));
    return paginationItems;
  };

  const generatePaginationItems = () =>
    totalPages <= 7
      ? generateSimplePaginationItems()
      : generateComplexPaginationItems();

  return (
    <Pagination>
      <Pagination.Prev onClick={prevPage} data-testid={`${testId}-prev`} />
      {generatePaginationItems()}
      <Pagination.Next onClick={nextPage} data-testid={`${testId}-next`} />
    </Pagination>
  );
};

export default OurPagination;
