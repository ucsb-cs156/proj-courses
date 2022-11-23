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

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import SingleQuarterDropdown from '../Quarters/SingleQuarterDropdown';
import { quarterRange } from 'main/utils/quarterUtilities';
import { useSystemInfo } from "main/utils/systemInfo";

function PersonalScheduleForm({
  initialPersonalSchedule,
  submitAction,
  buttonLabel = stryMutAct_9fa48("199") ? "" : (stryCov_9fa48("199"), "Create")
}) {
  if (stryMutAct_9fa48("200")) {
    {}
  } else {
    stryCov_9fa48("200");
    const {
      data: systemInfo
    } = useSystemInfo(); // Stryker disable OptionalChaining

    const startQtr = stryMutAct_9fa48("203") ? systemInfo?.startQtrYYYYQ && "20211" : stryMutAct_9fa48("202") ? false : stryMutAct_9fa48("201") ? true : (stryCov_9fa48("201", "202", "203"), systemInfo?.startQtrYYYYQ || (stryMutAct_9fa48("205") ? "" : (stryCov_9fa48("205"), "20211")));
    const endQtr = stryMutAct_9fa48("208") ? systemInfo?.endQtrYYYYQ && "20214" : stryMutAct_9fa48("207") ? false : stryMutAct_9fa48("206") ? true : (stryCov_9fa48("206", "207", "208"), systemInfo?.endQtrYYYYQ || (stryMutAct_9fa48("210") ? "" : (stryCov_9fa48("210"), "20214"))); // Stryker enable OptionalChaining

    const quarters = quarterRange(startQtr, endQtr); // Stryker disable all

    const {
      register,
      formState: {
        errors
      },
      handleSubmit
    } = useForm({
      defaultValues: initialPersonalSchedule || {}
    }); // Stryker enable all

    const navigate = useNavigate();
    const [quarter, setQuarter] = useState({
      quarters: quarters
    }.quarters[0]);
    return <Form onSubmit={handleSubmit(submitAction)}>

            {initialPersonalSchedule && <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control data-testid="PersonalScheduleForm-id" id="id" type="text" {...register("id")} value={initialPersonalSchedule.id} disabled />
                </Form.Group>}

            <Form.Group className="mb-3">
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control data-testid="PersonalScheduleForm-name" id="name" type="text" isInvalid={Boolean(errors.name)} {...register("name", {
          required: "Name is required."
        })} />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control data-testid="PersonalScheduleForm-description" id="description" type="text" isInvalid={Boolean(errors.description)} {...register("description", {
          required: "Description is required."
        })} />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" data-testid="PersonalScheduleForm-quarter">
                
                <SingleQuarterDropdown quarter={quarter} setQuarter={setQuarter} controlId={"PersonalScheduleForm-quarter"} label={"Quarter"} quarters={quarters} />
            </Form.Group>


            <Button type="submit" data-testid="PersonalScheduleForm-submit">
                {buttonLabel}
            </Button>
            <Button variant="Secondary" onClick={() => navigate(-1)} data-testid="PersonalScheduleForm-cancel">
                Cancel
            </Button>

        </Form>;
  }
}

export default PersonalScheduleForm;