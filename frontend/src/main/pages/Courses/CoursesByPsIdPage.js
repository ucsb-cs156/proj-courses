import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseTable from 'main/components/Courses/CourseTable';
import { useCurrentUser } from 'main/utils/currentUser'

import { useLocation } from "react-router-dom";

export default function CoursesByPsIdPage() {

    const currentUser = useCurrentUser();
    const {state} = useLocation();
    const {id} = state;

    const { data: courses, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/courses/user/psid/all"],
            { method: "GET", url: "/api/courses/user/psid/all/", params:{psId: id}},
            []
        );

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Courses for Personal Schedule: {id}</h1>
                <CourseTable courses={courses} currentUser={currentUser} />
            </div>
        </BasicLayout>
    )
}