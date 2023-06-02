import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PersonalSchedulesTable from 'main/components/PersonalSchedules/PersonalSchedulesTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function PersonalSchedulesIndexPage() {

    const currentUser = useCurrentUser();

    const { data: personalSchedules, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/personalschedules/all"],
            { method: "GET", url: "/api/personalschedules/all" },
            []
        );

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Personal Schedules</h1>
                <PersonalSchedulesTable personalSchedules={personalSchedules} currentUser={currentUser} />
            </div>
        </BasicLayout>
    )
}