import { useState } from "react";
import { FamilyProps, demandSimulation } from "../(services)/demand";
import { toast } from "react-toastify";

const useDemandSimulation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendSimulation = async (politics: FamilyProps) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await demandSimulation(politics);
      setIsLoading(false);
      toast.success(
        "Processo completo, escolha uma data para visualizar simulação"
      );
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
