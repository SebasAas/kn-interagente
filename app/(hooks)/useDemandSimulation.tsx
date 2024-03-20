import { useState } from "react";
import { FamilyProps, demandSimulation } from "../(services)/demand";

const useDemandSimulation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (politics: FamilyProps) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await demandSimulation(politics);
      setIsLoading(false);
      return res; // Optionally return the response if it might be used
    } catch (error) {
      console.error(error);
      setError(error as any);
      setIsLoading(false);
    }
  };

  return { handleSend, isLoading, error };
};

export default useDemandSimulation;
