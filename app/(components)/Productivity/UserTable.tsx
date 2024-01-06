import React from "react";

const UserTable = () => {
  const dados = {
    "Caixas HPC": 100,
    "Caixas FOOD": 88,
    "Caixas Aero": 33,
    Paletes: 61,
    Distância: 60,
    "Horas extras": 13,
  };

  return (
    <div className="mt-10 w-1/3  h-2/5">
      <table className="h-full w-full">
        <tbody>
          {Object.entries(dados).map(([chave, valor], index) => (
            <tr className={`text-sm ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`} key={chave}>
              <td className="pl-2 pr-12">{chave}</td>
              <td className="ml-auto pr-2">{valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
