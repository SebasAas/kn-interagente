import React, { useState } from "react";

const DateFilter = () => {
  const [activeFilter, setActiveFilter] = useState("");
  const handleFilterClick = (filter: any) => {
    setActiveFilter(filter);
    //logica de aplicação do filtro aqui
  };
  return (
    <div>
      <button
        onClick={() => handleFilterClick("ontem")}
        className={`rounded-full px-2 py-1 mr-2 ${
            activeFilter === 'ontem' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-solid border-1 border-blue-500'
          }`}
      >
        Ontem
      </button>
      <button
        onClick={() => handleFilterClick("semana")}
        className={`rounded-full px-2 py-1 mr-2 ${
            activeFilter === 'semana' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-solid border-1 border-blue-500'
          }`}
      >
        Semana
      </button>
      <button
        onClick={() => handleFilterClick("30dias")}
        className={`rounded-full px-2 py-1 mr-2 ${
            activeFilter === '30dias' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-solid border-1 border-blue-500'
          }`}
      >
        30 Dias
      </button>
      <button
        onClick={() => handleFilterClick("3meses")}
        className={`rounded-full px-2 py-1 mr-2 ${
            activeFilter === '3meses' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-solid border-1 border-blue-500'
          }`}
      >
        3 Meses
      </button>
      <button
        onClick={() => handleFilterClick("6meses")}
        className={`rounded-full px-2 py-1 mr-2 ${
            activeFilter === '6meses' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-solid border-1 border-blue-500'
          }`}
      >
        6 Meses
      </button>
    </div>
  );
};

export default DateFilter;