// Helpers
import dynamic from "next/dynamic";
import {
  fetchUploadStatus,
  getDashDT,
  getSimulation,
} from "../(services)/demand";

const Planning = dynamic(() => import("../(components)/Planning"), {
  ssr: false,
});

export default async function PlanningPage() {
  const simulationFetch = await getSimulation();
  const dashDTFetch = await getDashDT();
  const uploadStatusFetch = await fetchUploadStatus();

  return (
    <main className="min-h-[100vh]">
      <Planning
        simulationFetch={simulationFetch}
        dashDTFetch={dashDTFetch}
        uploadStatusFetch={uploadStatusFetch}
      />
    </main>
  );
}
