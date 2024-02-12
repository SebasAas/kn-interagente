import React, { useState } from 'react';

interface DateSelectorProps {
    onDateSelect: (date: Date) => void;
}

function isToday(date: Date) {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

const DateSelector: React.FC<DateSelectorProps> = ({onDateSelect}) => {
    const [dates, setDates] = useState<Date[]>(generateDates());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    function generateDates(): Date[] {
        const today = new Date();
        const datesArray = [today];
        for (let i = 1; i < 5; i++) {
            const nextDay = new Date();
            nextDay.setDate(today.getDate() + i);
            datesArray.push(nextDay);
        }
        return datesArray;
    }
    return (
        <div className='flex space-x-2 w-full justify-between'>
            {dates.map((date, index)=>(
                <div 
                key={index} 
                className={`cursor-pointer border-none rounded p-1 w-1/5 bg-gray-100 text-center hover:bg-[#003369] hover:text-white ${
                    selectedDate?.getTime() === date.getTime() ? 'bg-[#003369]' : 'border-gray-300'
                  }`} 
                onClick={() => {onDateSelect(date); setSelectedDate(date) }}
                >
                  {isToday(date) ? 'Hoje' : date.toLocaleDateString('pt-BR', { day:'numeric', month:'numeric'})}  
                </div>
            ))}        
        </div>
    )
};

export default DateSelector;