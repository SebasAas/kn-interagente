import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import React from "react";

function Alerts() {
  const arr = [
    {
      date: "25/09",
      shift: "1",
      description: "Usuário LOZTPMSB alocado em escalas consecutivas",
      alert: "error",
    },
    {
      date: "25/09",
      shift: "2",
      description: "Demanda excedente",
      alert: "error",
    },
    {
      date: "25/09",
      shift: "3",
      description: "Usuário LOZTPLFO contabilizando horas extras",
      alert: "warning",
    },
    {
      date: "26/09",
      shift: "1",
      description: "Usuário LOZTPLFO contabilizando horas extras",
      alert: "warning",
    },
  ];
  return (
    <Card className="p-4 h-fit ">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h2 className="">Alertas</h2>
      </CardHeader>
      <CardBody className="overflow-visible flex flex-row px-4 gap-4">
        {arr.map((item) => (
          <Card
            key={item.date + "-" + item.shift}
            className={`py-2 px-4 h-auto w-[220px] !shadow-none border-1 border-solid ${
              item.alert === "error" ? "bg-[#AC3E31]" : "bg-[#DBCE58]"
            }`}
          >
            <CardHeader className="flex justify-between text-gray-50 font-bold">
              <p>{item.shift}° turno</p>
              <p>{item.date}</p>
            </CardHeader>
            <CardBody className="overflow-visible flex justify-center items-center">
              <p className="text-center text-white">{item.description}</p>
            </CardBody>
            <CardFooter>
              <button className="bg-white w-full rounded-md flex py-2 justify-center">
                Alterar escala
              </button>
            </CardFooter>
          </Card>
        ))}
      </CardBody>
    </Card>
  );
}

export default Alerts;
