// import React from "react";
// import { useBackend } from "main/utils/useBackend";

// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import EnrollmentDataIndexPage from "main/components/EnrollmentData/EnrollmentDataIndexPage";
// import { useCurrentUser, hasRole } from "main/utils/currentUser";
// import { Button } from "react-bootstrap";

// export default function EnrollmentDatawIndexPage() {
//   const currentUser = useCurrentUser();

//   const {
//     data: EnrollmentData,
//     error: _error,
//     status: _status,
//   } = useBackend(
//     // Stryker disable next-line all : don't test internal caching of React Query
//     ["/api/enrollmentdata/all"],
//     { method: "GET", url: "/api/enrollmentdata/all" },
//     // Stryker disable next-line all : don't test default value of empty list
//     [],
//   );

//   const createButton = () => {
//     if (hasRole(currentUser, "ROLE_ADMIN")) {
//       return (
//         <Button
//           variant="primary"
//           href="/enrollmentdata/create"
//           style={{ float: "right" }}
//         >
//           Create Menu Item Review
//         </Button>
//       );
//     }
//   };

//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         {createButton()}
//         <h1>Menu Item Reviews</h1>
//         <MenuItemReviewTable
//           menuItemReviews={menuItemReviews}
//           currentUser={currentUser}
//         />
//       </div>
//     </BasicLayout>
//   );
// }
