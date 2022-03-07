import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


function PersonalScheduleForm({ initialPersonalSchedule, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialPersonalSchedule || {}, }
    );
    // Stryker enable all

    const navigate = useNavigate();

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialPersonalSchedule && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="PersonalScheduleForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialPersonalSchedule.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid="PersonalScheduleForm-name"
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Name is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                    data-testid="PersonalScheduleForm-description"
                    id="description"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("description", {
                        required: "Description is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="quarter">Quarter</Form.Label>
                <Form.Control
                    data-testid="PersonalScheduleForm-quarter"
                    id="quarter"
                    type="text"
                    isInvalid={Boolean(errors.quarter)}
                    {...register("quarter", {
                        required: "Quarter is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.quarter?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Button
                type="submit"
                data-testid="PersonalScheduleForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="PersonalScheduleForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default PersonalScheduleForm;