import React from "react";

interface User {
    rankingPosition: number;
    id: string;
    indicators: number[];
}

const UserProfile = (user: User) => {
  const { rankingPosition, id, indicators } = user;

  return (
    <div className="flex gap-4 mt-12 ">
      <div className="flex flex-col gap-3 mr-10">
        <p className="text-4xl font-bold">{`${rankingPosition}º`}</p>
        <p className="text-sm">{id}</p>
      </div>
      {Array.isArray(indicators) && indicators.length > 0 ? (
        indicators.map((indicator, index) => (
          <div key={index} className="flex flex-col">
            <p className="text-gray-400 text-sm">Título {index + 1}</p>
            <span className="text-blue-950 text-3xl font-bold">{indicator}</span>
          </div>
        ))
      ) : (
        <p>Sem indicadores</p>
      )}
    </div>
  );
};

export default UserProfile;
