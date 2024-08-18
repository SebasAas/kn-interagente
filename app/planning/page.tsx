// Helpers
import dynamic from "next/dynamic";
import { getSimulation } from "../(services)/demand";

const Planning = dynamic(() => import("../(components)/Planning"), {
  ssr: false,
});

export default async function PlanningPage() {
  const simulationFetch = await getSimulation();

  console.log("simulationFetch", simulationFetch);

  if (simulationFetch?.detail) {
    if (simulationFetch?.detail.includes("Não tem dados")) {
      // toast.info(
      //   <div>
      //     <h2>Não encontramos dados de grafico para essa data</h2>
      //   </div>
      // );
      console.log("Não encontramos dados de grafico para essa data");
    } else {
      // toast.error(
      //   <div>
      //     <h2>Algo deu errado obtendo graficos, tente novamente!</h2>
      //   </div>
      // );
      console.log("Algo deu errado obtendo graficos, tente novamente!");
    }
  }

  return (
    <main className="h-[100vh]">
      <Planning simulationFetch={simulationFetch} />
    </main>
  );
}
