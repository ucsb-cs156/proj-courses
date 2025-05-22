import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";

export const emptyArray = () => []; // factored out for Stryker testing

const OurPagination = ({
  updateActivePage,
  totalPages = 10,
  maxPages = 8,
  testId = "OurPagination",
  currentPage = 1,
}) => {
  const [activePage, setActivePage] = useState(currentPage);

  useEffect(() => {
    setActivePage(currentPage);
  }, [currentPage]);

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

  const generatePaginationItemsWithEllipsis = () => {
    const paginationItems = emptyArray();

    const leftEllipsis = activePage > 3;
    const rightEllipsis = activePage < totalPages - 2;

    paginationItems.push(pageButton(1));
    if (leftEllipsis) {
      paginationItems.push(
        <Pagination.Ellipsis
          key="left-ellipsis"
          data-testid={`${testId}-left-ellipsis`}
        />,
      );
    }
    // Show a range of pages around the active page
    let start = Math.max(activePage - 1, 2);
    let end = Math.min(activePage + 1, totalPages - 1);

    for (let number = start; number <= end; number++) {
      paginationItems.push(pageButton(number));
    }

    if (rightEllipsis) {
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
    totalPages <= maxPages
      ? generateSimplePaginationItems()
      : generatePaginationItemsWithEllipsis();

  return (
    <Pagination>
      <Pagination.Prev onClick={prevPage} data-testid={`${testId}-prev`} />
      {generatePaginationItems()}
      <Pagination.Next onClick={nextPage} data-testid={`${testId}-next`} />
    </Pagination>
  );
};

export default OurPagination;
