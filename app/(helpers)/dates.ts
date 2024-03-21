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
  const date = new Date(dateString);
  // Options to get day and month
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
  };
  // Convert to local date string with specified options
  return date.toLocaleDateString("en-GB", options); // Using 'en-GB' to ensure DD/MM format
}
