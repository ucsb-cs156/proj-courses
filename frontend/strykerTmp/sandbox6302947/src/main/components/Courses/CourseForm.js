// @ts-nocheck
function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function CourseForm({
  initialCourse,
  submitAction,
  buttonLabel = stryMutAct_9fa48("79") ? "" : (stryCov_9fa48("79"), "Create")
}) {
  if (stryMutAct_9fa48("80")) {
    {}
  } else {
    stryCov_9fa48("80");
    // Stryker disable all
    const {
      register,
      formState: {
        errors
      },
      handleSubmit
    } = useForm({
      defaultValues: initialCourse || {}
    }); // Stryker enable all

    const navigate = useNavigate();
    return <Form onSubmit={handleSubmit(submitAction)}>

            {initialCourse && <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control data-testid="CourseForm-id" id="id" type="text" {...register("id")} value={initialCourse.id} disabled />
                </Form.Group>}

            <Form.Group className="mb-3">
                <Form.Label htmlFor="enrollCd">Enrollment Code</Form.Label>
                <Form.Control data-testid="CourseForm-enrollCd" id="enrollCd" type="text" isInvalid={Boolean(errors.enrollCd)} {...register("enrollCd", {
          required: "Enroll Code is required."
        })} />
                <Form.Control.Feedback type="invalid">
                    {errors.enrollCd?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="psId">Personal Schedule ID</Form.Label>
                <Form.Control data-testid="CourseForm-psId" id="psId" type="text" isInvalid={Boolean(errors.psId)} {...register("psId", {
          required: "Personal Schedule ID is required."
        })} />
                <Form.Control.Feedback type="invalid">
                    {errors.psId?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" data-testid="CourseForm-submit">
                {buttonLabel}
            </Button>
            <Button variant="Secondary" onClick={() => navigate(-1)} data-testid="CourseForm-cancel">
                Cancel
            </Button>

        </Form>;
  }
}

export default CourseForm;