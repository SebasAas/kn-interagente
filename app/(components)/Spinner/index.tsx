import React from "react";
import { CircularProgress } from "@nextui-org/react";

// Adjust the Spinner to accept a value prop
export const Spinner = ({ value }: { value: number }) => {
  return (
    <CircularProgress
      aria-label="Loading..."
      size="md"
      value={value}
      showValueLabel={true}
      classNames={{
        indicator: "bg-blue-600",
      }}
    />
  );
};
