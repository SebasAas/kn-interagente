"use client";
import React from 'react';

interface TableProps {
  data: DataItem[];
}

interface DataItem {
  turno: string;
  hora: string;
  caixas: number;
  pallets: number;
  visitas: number;
  aux: string;
  ope: string;
}

const BoxSeparation: React.FC<TableProps> = ({ data }) => {

const cellCollor = (required: number, allocated: number): string => {
  if (required <= allocated) {
    return 'bg-[#8ab187]'; 
  } else if (required === allocated + 1) {
    return 'bg-[#dbae58]';
  } else {
    return 'bg-[#ac3e31]'; 
  }
};

const totalCaixas = data.reduce((acc, curr) => acc + curr.caixas, 0);
const totalPallets = data.reduce((acc, curr) => acc + curr.pallets, 0);

return (
  <div className="overflow-x-auto w-full h-full">
    <table className="w-full h-full">
      <thead>
        <tr>
          <th className="border-hidden text-gray-400">Turno</th>
          <th className="border-hidden text-gray-400">Hora</th>
          <th className="border-hidden text-gray-400">Caixas</th>
          <th className="border-hidden text-gray-400">Pallets</th>
          <th className="border-hidden text-gray-400">Visitas</th>
          <th className="border-hidden text-gray-400">Aux.</th>
          <th className="border-hidden text-gray-400">Ope.</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {/* Coluna de turno */}
            {index === 0 && (
              <td className="border-none" rowSpan={data.length}>
                <div className='flex flex-col bg-[#003369] text-white h-full justify-around text-center p-2'>
                  <span className='text-2xl'>1º</span>
                  <span className='text-sm'>Caixas</span>
                  <span className='text-lg'>{totalCaixas}</span>
                  <span className='text-sm'>Pallets</span>
                  <span className='text-lg'>{totalPallets}</span>
                </div>
              </td>
            )}
            <td className="border-none text-center ">{item.hora}</td>
            <td className="border-none text-center ">{item.caixas}</td>
            <td className="border-none text-center ">{item.pallets}</td>
            <td className="border-none text-center ">{item.visitas}</td>
            <td className={`border-none text-white text-center  ${cellCollor(parseInt(item.aux.split('/')[0]), parseInt(item.aux.split('/')[1]))}`}>{item.aux}</td>
            <td className={`border-none text-white text-center  ${cellCollor(parseInt(item.ope.split('/')[0]), parseInt(item.ope.split('/')[1]))}`}>{item.ope}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};



export default BoxSeparation;
