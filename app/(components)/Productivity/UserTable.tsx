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

export interface Data {
  _id: string;
  worker_code: string;
  month_year: string;
  shift: number;
  work: number;
  position: number;
  score: number;
  workloads: Workload[];
}

const UserTable = ({ data }: { data: Data }) => {
  console.log(data);
  // Accumulate production for "AERO", "HPC", and "FOODS"
  const productionData = data?.workloads?.reduce(
    (acc: Record<string, number>, workload: Workload) => {
      if (["AERO", "HPC", "FOODS"].includes(workload.product_type)) {
        acc[workload.product_type] =
          (acc[workload.product_type] || 0) + workload.production;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="mt-10 w-1/3 h-2/5">
      <table className="h-full w-full">
        <tbody>
          {productionData &&
            Object.entries(productionData).map(
              ([productType, production], index) => (
                <tr
                  className={`text-sm ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                  key={productType}
                >
                  <td className="pl-2 pr-12">{productType}</td>
                  <td className="ml-auto pr-2">{production}</td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
