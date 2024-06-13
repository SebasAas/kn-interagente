import { useState } from "react";
import { FamilyProps, fetchProductivityStats } from "../(services)/demand";
import { toast } from "react-toastify";

const useGetProductivityStats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetProducitivityStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchProductivityStats();
      setIsLoading(false);

      return res;
    } catch (error) {
      console.error(error);
      setError(error as any);
      setIsLoading(false);
    }
  };

  return { handleGetProducitivityStats, isLoading, error };
};

export default useGetProductivityStats;
