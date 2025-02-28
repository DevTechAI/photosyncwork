
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  weekDays: Date[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  navigatePreviousWeek: () => void;
  navigateNextWeek: () => void;
}

export function CalendarHeader({ 
  weekDays, 
  selectedDate, 
  setSelectedDate,
  navigatePreviousWeek,
  navigateNextWeek 
}: CalendarHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={navigatePreviousWeek}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-medium">
          {format(weekDays[0] || new Date(), 'MMMM yyyy')}
        </h2>
        
        <button 
          onClick={navigateNextWeek}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Days of the week */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div 
              key={index} 
              className="text-center cursor-pointer"
              onClick={() => setSelectedDate(day)}
            >
              <div className="text-sm text-gray-500 font-medium">
                {format(day, 'EEE')}
              </div>
              <div 
                className={`
                  rounded-full mx-auto w-10 h-10 flex items-center justify-center mt-1
                  ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
                `}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

import { isSameDay } from "date-fns";
