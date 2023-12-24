import React from "react";

const UserProfile = (user: any) => {
  const { photo, rankingPosition, name, age, sector, indicators } = user;

  return (
    <div className="flex gap-4 mt-4">
      <img src={photo} alt={`perfil do ${name}`} className="rounded-xl" />
      <div className="flex flex-col gap-3">
        <p className="text-4xl font-bold">{rankingPosition}</p>
        <p>{name}</p>
        <p>{`${age} anos`}</p>
        <p>{sector}</p>
      </div>
      <h4>Indicadores</h4>
      {Array.isArray(indicators) && indicators.length > 0 ? (
        indicators.map((indicator, index) => (
          <div key={index}>
            <p>Título {index + 1}</p>
            <span>{indicator}</span>
          </div>
        ))
      ) : (
        <p>Sem indicadores</p>
      )}
    </div>
  );
};

export default UserProfile;
