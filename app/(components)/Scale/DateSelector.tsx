import React, { useState } from 'react';

interface DateSelectorProps {
    onDateSelect: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateSelect }) => {
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

    function isToday(date: Date) {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    return (
        <div className='flex flex-col space-y-2 justify-between'>
            {dates.map((date, index) => (
                <div key={index} className='flex flex-row justify-between'>
                    <div
                        className={`cursor-pointer rounded p-1 w-1/2 text-center ${
                            selectedDate && selectedDate.getTime() === date.getTime()
                                ? 'bg-[#003369] text-white'
                                : isToday(date)
                                    ? 'bg-gray-200'
                                    : 'bg-gray-100'
                        }`}
                        onClick={() => {
                            onDateSelect(date);
                            setSelectedDate(date);
                        }}
                    >
                        {date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[#AC3E31] ml-2 mt-2"></div>
                </div>
            ))}
        </div>
    );
};

export default DateSelector;
