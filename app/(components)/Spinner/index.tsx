import React from "react";
import { CircularProgress } from "@nextui-org/react";

// Adjust the Spinner to accept a value prop
export const Spinner = ({
  value,
  size = "md",
}: {
  value: number | undefined;
  size?: "md" | "sm" | "lg" | undefined;
}) => {
  return (
    <CircularProgress
      aria-label="Loading..."
      size={size}
      value={value || undefined}
      showValueLabel={true}
      classNames={{
        indicator: "bg-blue-600",
      }}
    />
  );
};
