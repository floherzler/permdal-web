export const dynamic = "force-dynamic";

import React from "react";
import { getStaffeln } from "../actions/getStaffeln";
import StaffelList from "@/components/StaffelList";

export default async function Page() {
  const staffeln: Staffel[] = await getStaffeln();
  return (
    <main>
      <StaffelList initialStaffeln={staffeln} />
    </main>
  );
};
