"use client";
import { Divider } from "@nextui-org/react";
import BoxSeparation from "../(components)/Scale/BoxSeparation";
import DateSelector from "../(components)/Scale/DateSelector"

import { generateFakeData } from "./dadosmock";

const ScalePage: React.FC = () => {
    const dadosMock = generateFakeData();
    function handleDateSelect(date: Date) {
        //Lógica pra carregar dados do back
        console.log("Carregar dados para:", date);
    }
    return (
        <div>
            <div className="flex flex-row mt-8 p-4 border-1 border-solid rounded-lg transform rotate-x-2 shadow-md">
                <DateSelector onDateSelect={handleDateSelect} />
            </div>
            <div className="flex flex-row mt-8 p-4 border-1 border-solid rounded-lg transform rotate-x-2 shadow-md w-5/12 h-96">
            <BoxSeparation data={dadosMock} />
            <Divider />
            </div>
        </div>
    )
}

export default ScalePage;