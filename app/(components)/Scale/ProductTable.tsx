import React, { useState } from 'react';

interface ProductData {
  hora: string;
  estimado: number;
  caixas: number;
  visitas: number;
}

interface ProductTableProps {
  productData: { [key: string]: ProductData[] };
}

const ProductTable: React.FC<ProductTableProps> = ({ productData }) => {
  const [selectedFamily, setSelectedFamily] = useState<string>('');

  //  renderiza os dados da família selecionada
  const renderFamilyData = () => {
    if (!selectedFamily || !productData[selectedFamily]) return null;

    return productData[selectedFamily].map((data, index) => (
      <tr key={index}>
        <td>{data.hora}</td>
        <td>{data.estimado}</td>
        <td>{data.caixas}</td>
        <td>{data.visitas}</td>
      </tr>
    ));
  };

  return (
    <div>
      <select
        value={selectedFamily}
        onChange={(e) => setSelectedFamily(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md"
      >
        <option value="">Selecione uma família</option>
        {Object.keys(productData).map((family) => (
          <option key={family} value={family}>
            {family}
          </option>
        ))}
      </select>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Estimado</th>
            <th>Caixas</th>
            <th>Visitas</th>
          </tr>
        </thead>
        <tbody>
          {renderFamilyData()}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

