import { useState } from "react";
import {
  DemandSimulationType,
  FamilyProps,
  demandSimulation,
} from "../(services)/demand";
import { toast } from "react-toastify";

const useDemandSimulation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendSimulation = async (politics: DemandSimulationType) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await demandSimulation(politics);
      setIsLoading(false);

      if (res && "detail" in res) {
      } else {
        toast.success("Simulação atualizada com sucesso");
      }

      return res;
    } catch (error) {
      console.error(error);
      setError(error as any);
      setIsLoading(false);
    }
  };

  return { handleSendSimulation, isLoading, error };
};

export default useDemandSimulation;
