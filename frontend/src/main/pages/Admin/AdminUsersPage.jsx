import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UsersTable from "main/components/Users/UsersTable";
import { useBackend } from "main/utils/useBackend";

const AdminUsersPage = () => {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data: usersPage = {} } = useBackend(
    ["/api/admin/users", page, pageSize],
    {
      method: "GET",
      url: "/api/admin/users",
      params: { page, pageSize, sortDirection: "ASC" },
    }
  );

  const totalPages = usersPage.totalPages || 1;
  const users = usersPage.content || [];

  const getPageNumbers = () => {
    const pages = new Set([0, totalPages - 1]);
    for (let i = Math.max(0, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) {
      pages.add(i);
    }
    return [...pages].sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  const btnStyle = (active) => ({
    width: "36px",
    height: "36px",
    border: active
      ? "0.5px solid var(--bs-primary, #0d6efd)"
      : "1px solid #dee2e6",
    borderRadius: "4px",
    background: active ? "#0d6efd" : "white",
    color: active ? "white" : "#212529",
    fontWeight: active ? 500 : 400,
    fontSize: "13px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <BasicLayout>
      <h2>Users</h2>

      <UsersTable users={users} />

      <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
        {/* Previous */}
        <button
          style={btnStyle(false)}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          title="Previous page"
        >
          ‹
        </button>

        {pageNumbers.map((p, i) => {
          const prev = pageNumbers[i - 1];
          return (
            <React.Fragment key={p}>
              {prev !== undefined && p - prev > 1 && (
                <span style={{ width: "36px", textAlign: "center", color: "#6c757d", fontSize: "13px" }}>…</span>
              )}
              <button
                style={btnStyle(p === page)}
                onClick={() => setPage(p)}
              >
                {p + 1}
              </button>
            </React.Fragment>
          );
        })}

        {/* Next */}
        <button
          style={btnStyle(false)}
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
          title="Next page"
        >
          ›
        </button>
      </div>
    </BasicLayout>
  );
};

export default AdminUsersPage;