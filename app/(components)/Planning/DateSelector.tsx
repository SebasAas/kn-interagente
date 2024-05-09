import { useAppContext } from "@/app/(context)/AppContext";
import { Spinner } from "@nextui-org/react";
import React, { useReducer, useState } from "react";

interface DateSelectorProps {
  onDateSelect: (date: Date) => void;
  isLoading: boolean;
}

const COLORS = {
  uploaded: "bg-[#31ac48]",
  notUploaded: "bg-[#AC3E31]",
};

const DateSelector: React.FC<DateSelectorProps> = ({
  onDateSelect,
  isLoading,
}) => {
  const {
    dispatch,
    demands: { uploadStatus },
  } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  function isToday(date: Date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  console.log("uploadStatus", uploadStatus);

  return (
    <div className="flex flex-col space-y-2 justify-between">
      {isLoading && !uploadStatus.length && (
        <div className="w-full flex justify-center items-center">
          <Spinner size="sm" classNames={{}} />
        </div>
      )}
      {uploadStatus.map((status, index) => (
        <div key={index} className="flex flex-row justify-between">
          <div
            className={`cursor-pointer rounded p-1 w-1/2 text-center ${
              selectedDate &&
              selectedDate.getTime() === new Date(status.date).getTime()
                ? "bg-[#003369] text-white"
                : isToday(new Date(status.date))
                ? "bg-gray-200"
                : "bg-gray-100"
            }`}
            onClick={() => {
              onDateSelect(new Date(status.date));
              setSelectedDate(new Date(status.date));
              dispatch({
                type: "SET_SELECTED_SIMULATION_DATE",
                payload: status.date,
              });
            }}
          >
            {new Date(status.date).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "numeric",
            })}
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              status.uploaded ? COLORS.uploaded : COLORS.notUploaded
            } ml-2 mt-2`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default DateSelector;
