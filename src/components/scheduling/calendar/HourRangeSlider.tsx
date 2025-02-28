
import { Slider } from "@/components/ui/slider";

interface HourRangeSliderProps {
  hourRange: [number, number];
  setHourRange: (values: [number, number]) => void;
}

export function HourRangeSlider({ hourRange, setHourRange }: HourRangeSliderProps) {
  return (
    <div className="mt-4 mb-8 px-6">
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span>Hour Range</span>
        <span>{hourRange[0]}:00 - {hourRange[1]}:00</span>
      </div>
      <Slider 
        defaultValue={[8, 18]} 
        min={0} 
        max={24} 
        step={1}
        value={[hourRange[0], hourRange[1]]}
        onValueChange={(values) => setHourRange([values[0], values[1]])}
        className="py-2"
      />
    </div>
  );
}
