//Tabela antiga

/*
type dadosTabela = {
  turno: number;
  hora: string;
  caixas: number;
  pallets: number;
  visitas: number;
  aux: string;
  ope: string;
};

const BoxSeparation: React.FC = () => {
  const [dadosTabela, setDadosTabela] = useState<dadosTabela[]>([]);
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch("http://localhost:3004/table1");
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados.");
        }
        const dados = await response.json();
        setDadosTabela(dados);
      } catch (error) {
        console.error("Erro", error);
      }
    };

    fetchDados();
  }, []);

    // Objeto para manter a soma das caixas e pallets para cada turno
    const turnoSoma: { [key: number]: { caixas: number; pallets: number } } = {};

    // Calcular a soma das caixas e pallets para cada turno
    dadosTabela.forEach((item) => {
      if (!turnoSoma[item.turno]) {
        turnoSoma[item.turno] = { caixas: 0, pallets: 0 };
      }
      turnoSoma[item.turno].caixas += item.caixas;
      turnoSoma[item.turno].pallets += item.pallets;
    });

  const cellCollor = (required: number, allocated: number): string => {
    if (required <= allocated) {
      return "bg-[#8ab187]";
    } else if (required === allocated + 1) {
      return "bg-[#dbae58]";
    } else {
      return "bg-[#ac3e31]";
    }
  };

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
          {dadosTabela.map((item, index) => (
            <React.Fragment key={`${item.turno}-${item.hora}-${index}`}>
              {index > 0 && dadosTabela[index - 1].turno !== item.turno && (
                <tr>
                  <td colSpan={7}>
                    <Divider />
                  </td>
                </tr>
              )}
              <tr>
                {index === 0 || dadosTabela[index - 1].turno !== item.turno ? (
                  <td
                    className="border-2 border-solid border-white rounded-lg"
                    rowSpan={
                      dadosTabela.filter((d) => d.turno === item.turno)
                        .length
                    }
                  >
                    <div className="flex flex-col gap-2 bg-[#003369] text-white text-center h-full rounded-xl p-1">
                    <span className="mt-2 text-2xl">{`${item.turno}º`}</span>
                    <span className="text-sm">Caixas</span> 
                    <span className="text-lg">{turnoSoma[item.turno] ? turnoSoma[item.turno].caixas : 0}</span>
                    <span className="text-sm">Pallets</span> 
                    <span className="text-lg">{turnoSoma[item.turno] ? turnoSoma[item.turno].pallets : 0}</span>
                    </div>
                  </td>
                ) : null}
                <td className="border-2 border-solid border-white rounded-lg">{item.hora}</td>
                <td className="border-2 border-solid border-white rounded-lg text-center">{item.caixas}</td>
                <td className="border-2 border-solid border-white rounded-lg text-center">{item.pallets}</td>
                <td className="border-2 border-solid border-white rounded-lg text-center">{item.visitas}</td>
                <td
                  className={`border-2 border-solid border-white rounded-lg text-white text-center  ${cellCollor(
                    parseInt(item.aux.split("/")[0]),
                    parseInt(item.aux.split("/")[1])
                  )}`}
                >
                  {item.aux}
                </td>
                <td
                  className={`border-2 border-solid border-white rounded-lg text-white text-center  ${cellCollor(
                    parseInt(item.ope.split("/")[0]),
                    parseInt(item.ope.split("/")[1])
                  )}`}
                >
                  {item.ope}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoxSeparation;
*/
