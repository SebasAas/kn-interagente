// Helpers
import dynamic from "next/dynamic";
import { fetchUploadStatus, getSimulation } from "../(services)/demand";

const Planning = dynamic(() => import("../(components)/Planning"), {
  ssr: false,
});

export default async function PlanningPage() {
  const simulationFetch = await getSimulation();
  const uploadStatusFetch = await fetchUploadStatus();

  return (
    <main className="min-h-[100vh]">
      <Planning
        simulationFetch={simulationFetch}
        uploadStatusFetch={uploadStatusFetch}
      />
    </main>
  );
}
