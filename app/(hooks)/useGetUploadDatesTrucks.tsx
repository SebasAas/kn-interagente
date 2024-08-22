import { useEffect, useState } from "react";
import { useAppContext } from "../(context)/AppContext";
import { generateDates } from "../(helpers)/generateDates";

const useGetUploadDatesTrucks = () => {
  const { dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const getUploadFilesDate = async () => {
      try {
        const uploadDates = await generateDates();
        // dispatch({
        //   type: "SET_UPLOAD_STATUS",
        //   payload: uploadDates,
        // });
        setIsLoading(false);
      } catch (error: unknown) {
        console.error("Failed to fetch upload dates:", error);
        setError(error as any);
        setIsLoading(false);
      }
    };

    getUploadFilesDate();
  }, [dispatch]);

  return { isLoading, error };
};

export default useGetUploadDatesTrucks;
