import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import JobsTable from "main/components/Jobs/JobsTable";

import Accordion from "react-bootstrap/Accordion";
import Pagination from "react-bootstrap/Pagination";

import TestJobForm from "main/components/Jobs/TestJobForm";
import SingleButtonJobForm from "main/components/Jobs/SingleButtonJobForm";
import UpdateCoursesJobForm from "main/components/Jobs/UpdateCoursesJobForm";
import UpdateCoursesByQuarterJobForm from "main/components/Jobs/UpdateCoursesByQuarterJobForm";
import UpdateCoursesByQuarterRangeJobForm from "main/components/Jobs/UpdateCoursesByQuarterRangeJobForm";

export default function AdminJobsPage() {
  const REFRESH_MS = 5000;

  // Jobs list and pagination state
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);

  // Sorting state: field and direction (desc by default)
  const [sortField, setSortField] = useState("createdAt");
  const [sortDesc, setSortDesc] = useState(true);

  // Loading / error state for the table
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch jobs from the backend.
   * We send the usual paging & sorting params so that
   * real‐world pagination works.  Axios‐mock‐adapter
   * will still match on "/api/jobs/all" regardless of query‐string.
   *
   * The server may return either:
   *   1. A plain array of job objects (for your fixtures/tests)
   *   2. A paged object { content: Job[], totalPages: number }
   * We detect and handle both shapes.
   */
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/jobs/all", {
        params: {
          page,
          size: 10,
          sortField,
          sortDir: sortDesc ? "DESC" : "ASC",
        },
      });

      const data = res.data;
      if (Array.isArray(data)) {
        // Fixtures / tests return a plain array
        setJobs(data);
        setTotalPages(1);
      } else if (data.content && Array.isArray(data.content)) {
        // Real paged response
        setJobs(data.content);
        setTotalPages(data.totalPages ?? 1);
      } else {
        // Unexpected shape: clear table
        setJobs([]);
        setTotalPages(1);
      }
    } catch (e) {
      console.error(e);
      setError("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  }, [page, sortField, sortDesc]);

  // Initial load and whenever page/sort changes
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Periodic refresh every REFRESH_MS milliseconds
  useEffect(() => {
    const iv = setInterval(fetchJobs, REFRESH_MS);
    return () => clearInterval(iv);
  }, [fetchJobs]);

  /** Handler to purge all jobs */
  const handlePurge = async () => {
    await axios.delete("/api/jobs/all");
    // After purge, reset to first page and reload
    setPage(0);
    fetchJobs();
  };

  /** Handler to toggle sorting direction or change sort field */
  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDesc((prev) => !prev);
    } else {
      setSortField(field);
      setSortDesc(false);
    }
    setPage(0);
  };

  // Build pagination items if there is more than one page
  const paginationItems = [];
  for (let i = 0; i < totalPages; i++) {
    paginationItems.push(
      <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
        {i + 1}
      </Pagination.Item>,
    );
  }

  // Definitions for the various "Launch Job" forms
  const jobLaunchers = [
    {
      name: "Test Job",
      form: (
        <TestJobForm
          submitAction={async (d) =>
            axios.post(
              `/api/jobs/launch/testjob?fail=${d.fail}&sleepMs=${d.sleepMs}`,
            )
          }
        />
      ),
    },
    {
      name: "Update Courses Database",
      form: (
        <UpdateCoursesJobForm
          callback={async (d) =>
            axios.post(
              `/api/jobs/launch/updateCourses?quarterYYYYQ=${d.quarter}&subjectArea=${d.subject}&ifStale=${d.ifStale}`,
            )
          }
        />
      ),
    },
    {
      name: "Update Courses Database by quarter",
      form: (
        <UpdateCoursesByQuarterJobForm
          callback={async (d) =>
            axios.post(
              `/api/jobs/launch/updateQuarterCourses?quarterYYYYQ=${d.quarter}&ifStale=${d.ifStale}`,
            )
          }
        />
      ),
    },
    {
      name: "Update Courses Database by quarter range",
      form: (
        <UpdateCoursesByQuarterRangeJobForm
          callback={async (d) =>
            axios.post(
              `/api/jobs/launch/updateCoursesRangeOfQuarters?start_quarterYYYYQ=${d.startQuarter}&end_quarterYYYYQ=${d.endQuarter}&ifStale=${d.ifStale}`,
            )
          }
        />
      ),
    },
    {
      name: "Update Grade Info",
      form: (
        <SingleButtonJobForm
          callback={async () => axios.post("/api/jobs/launch/uploadGradeData")}
          text="Update Grades"
        />
      ),
    },
  ];

  return (
    <BasicLayout>
      <h2 className="p-3">Launch Jobs</h2>
      <Accordion>
        {jobLaunchers.map((jl, idx) => (
          <Accordion.Item eventKey={String(idx)} key={idx}>
            <Accordion.Header>{jl.name}</Accordion.Header>
            <Accordion.Body>{jl.form}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <h2 className="p-3">Job Status</h2>
      <JobsTable
        jobs={jobs}
        loading={loading}
        error={error}
        sortBy={{ id: sortField, desc: sortDesc }}
        onSortChange={handleSortChange}
        onPurge={handlePurge}
      />

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          {paginationItems}
        </Pagination>
      )}
    </BasicLayout>
  );
}
