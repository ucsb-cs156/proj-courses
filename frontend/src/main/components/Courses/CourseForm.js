import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PersonalScheduleDropdown from "../PersonalSchedules/PersonalScheduleDropdown";
import { useBackend } from "main/utils/useBackend";

function CourseForm({ initialCourse, submitAction, buttonLabel = "Create" }) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialCourse || {} });
  // Stryker restore all

  const navigate = useNavigate();

  const {
    data: schedules,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/personalschedules/all"],
    // Stryker disable next-line all : don't test internal caching of React Query
    { method: "GET", url: "/api/personalschedules/all" },
    [],
  );

  // Stryker disable all : not sure how to test/mock local storage
  const localSchedule = localStorage.getItem("CourseForm-psId");
  const [schedule, setSchedule] = useState(localSchedule || "");
  if (schedule) {
    localStorage.setItem("CourseForm-psId", schedule);
  }
  // Stryker restore all

  useEffect(() => {
    // Stryker disable all : not sure how to test/mock local storage
    if (localSchedule && schedules && schedules.length > 0) {
      schedules.find((element) => element === localSchedule);
    }
    if (schedules && schedules.length > 0 && !localSchedule) {
      setSchedule(schedules[0].id);
      // Stryker disable all : not sure how to test/mock local storage
      localStorage.setItem("CourseForm-psId", schedules[0].id);
      // Stryker restore all
    }
  }, [schedules, localSchedule]);

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialCourse && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid="CourseForm-id"
            id="id"
            type="text"
            {...register("id")}
            value={initialCourse.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="enrollCd">Enrollment Code</Form.Label>
        <Form.Control
          data-testid="CourseForm-enrollCd"
          id="enrollCd"
          type="text"
          isInvalid={Boolean(errors.enrollCd)}
          {...register("enrollCd", {
            required: "Enroll Code is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.enrollCd?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" data-testid="CourseForm-psId">
        <PersonalScheduleDropdown
          schedules={schedules}
          schedule={schedule}
          setSchedule={setSchedule}
          controlId={"CourseForm-psId"}
        />
      </Form.Group>

      <Button type="submit" data-testid="CourseForm-submit">
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid="CourseForm-cancel"
      >
        Cancel
      </Button>
    </Form>
  );
}

export default CourseForm;
