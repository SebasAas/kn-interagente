export function formatDateToHHMM(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return date.toLocaleTimeString("en-US", options);
}

export function formatDateToDDMM(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Options to get day and month
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
  };
  // Convert to local date string with specified options
  return date.toLocaleDateString("en-GB", options); // Using 'en-GB' to ensure DD/MM format
}

export const handleGetDataFormat = (uploadDate: string) => {
  if (uploadDate) {
    const date = new Date(uploadDate);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${hours}:${minutes} - ${day}/${month}`;
  }

  return "-";
};
