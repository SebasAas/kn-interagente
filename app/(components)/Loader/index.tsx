import ChartLoader from "@/app/(assets)/ChartLoader";
import React from "react";

function Loader({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ChartLoader />
    </div>
  );
}

export default Loader;
