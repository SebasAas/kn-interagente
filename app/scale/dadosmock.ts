export interface DataItem {
  turno: string;
  hora: string;
  caixas: number;
  pallets: number;
  visitas: number;
  aux: string;
  ope: string;
}

export const generateFakeData = (): DataItem[] => {
  const data: DataItem[] = [];
  const startHour = 6;
  const endHour = 13;

  for (let i = startHour; i <= endHour; i++) {
    const hora = `${i < 10 ? '0' : ''}${i}:00`;

    
    const requiredPeople = Math.floor(Math.random() * 20) + 1; 
    const allocatedPeople = Math.floor(Math.random() * requiredPeople) + 1;

    
    /*let backgroundColor = '';
    if (requiredPeople <= allocatedPeople) {
      backgroundColor = '#8ab187';
    } else if (requiredPeople === allocatedPeople + 1) {
      backgroundColor = '#dbae58';
    } else {
      backgroundColor = '#ac3e31';
    } */

    data.push({
      turno: '1º',
      hora,
      caixas: Math.floor(Math.random() * 10000),
      pallets: Math.floor(Math.random() * 5000),
      visitas: Math.floor(Math.random() * 1000),
      aux: `${requiredPeople}/${allocatedPeople}`, 
      ope: `${requiredPeople}/${allocatedPeople}`,
    });
  }

  return data;
};
