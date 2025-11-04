/* eslint-disable @typescript-eslint/no-explicit-any */

import AllUsers from "@/components/Admin/Users/AllUsers";
import ProtectedRoute from "@/Provider/ProtectedRoutes";

function page() {
  return (
    <ProtectedRoute allowedTypes={["admin"]}>
      <div>
        <AllUsers />
      </div>
    </ProtectedRoute>
  );
}

export default page;
