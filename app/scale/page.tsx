"use client";
import { CardBody, Divider } from "@nextui-org/react";
import BoxSeparation from "../(components)/Scale/BoxSeparation";
import DateSelector from "../(components)/Scale/DateSelector";
import AlertBoard from "../(components)/Scale/AlertBoard";
import UploadButton from "../(components)/Scale/UploadButton";

const ScalePage: React.FC = () => {
  function handleDateSelect(date: Date) {
    //Lógica pra carregar dados do back
    console.log("Carregar dados para:", date);
  }
    const handleUploadComplete = () => {
        console.log('Upload completo!');
      };

  return (
    <div>
      <div className="flex flex-row mt-8 p-4 border-1 border-solid rounded-lg transform rotate-x-2 shadow-md">
        <DateSelector onDateSelect={handleDateSelect} />
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col mt-8 p-4 border-1 border-solid rounded-lg transform rotate-x-2 shadow-md w-5/12 h-96 overflow-auto">
          <div>
            <BoxSeparation />
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-8 w-5/12">
          <div className=" flex flex-row border-1 border-solid rounded-lg transform rotate-x-2 shadow-md h-1/3">
            <AlertBoard />
          </div>
          <div className="border-1 border-solid rounded-lg transform rotate-x-2 shadow-md h-2/3"></div>
        </div>
        <div className="flex flex-col gap-4 mt-8 w-2/12">
            <div className="flex flex-col gap-8 border-1 border-solid rounded-lg transform rotate-x-2 shadow-md h-1/2">
                <h3 className="mt-4 ml-8">Escala</h3>
                <UploadButton onUploadComplete={handleUploadComplete}/>
            </div>
            <div className="flex flex-col gap-8 border-1 border-solid rounded-lg transform rotate-x-2 shadow-md h-1/2">
                <h3 className="mt-4 ml-8">Demanda</h3>
                <UploadButton onUploadComplete={handleUploadComplete}/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScalePage;
