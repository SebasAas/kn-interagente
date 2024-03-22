import React from "react";

interface Workload {
  _id: string;
  worker_code: string;
  month_year: string;
  shift: number;
  product_type: string;
  hours: number;
  distance: number;
  speed: number;
  work: number;
  production: number;
  productivity: number;
  visits: number;
  visits_per_hour: number;
  profile: number;
}

export interface UserTableProps {
  _id: string;
  worker_code: string;
  month_year: string;
  shift: number;
  work: number;
  position: number;
  score: number;
  workloads: Workload[];
}

const UserTable = ({ userData }: { userData: UserTableProps }) => {
  // Accumulate production for "AERO", "HPC", and "FOODS"
  const productionData = userData?.workloads?.reduce(
    (acc: Record<string, number>, workload: Workload) => {
      if (["AERO", "HPC", "FOODS"].includes(workload.product_type)) {
        acc[workload.product_type] =
          (acc[workload.product_type] || 0) + workload.production;
      }
      return acc;
    },
    {}
  );

  const palets: any = userData?.workloads?.filter(
    (el) => el.product_type === "AALL"
  );

  // Add new element to productionData that will be "pallets" and the value palets[0]?.pallets
  const productionDataWithPallets = {
    PALLETS: palets && palets.length > 0 && palets[0]?.pallets,
    DIRECT_HOURS: palets[0]?.direct_hours,
    DISTANCE: palets[0]?.distance.toFixed(0),
    ...productionData,
  };

  const refactorName = (key: string) => {
    switch (key) {
      case "DIRECT_HOURS":
        return "HORAS DIRETAS";
      case "DISTANCE":
        return "DISTÂNCIA";
      default:
        return key;
    }
  };

  return (
    <div className="mt-10 w-1/3 h-2/5">
      <table className="h-full w-full">
        <tbody>
          {productionDataWithPallets &&
            Object.entries(productionDataWithPallets).map(
              ([key, value], index) => (
                <tr
                  className={`text-sm  ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                  key={key}
                >
                  <td className="pl-2 py-2 pr-12">{refactorName(key)}</td>
                  <td className="ml-auto pr-2">{value}</td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
