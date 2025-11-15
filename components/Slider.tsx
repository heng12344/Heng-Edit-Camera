
import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, onChange, unit = '' }) => {
  return (
    <div className="space-y-2">
      <label className="flex justify-between items-center text-sm font-medium text-slate-300">
        <span>{label}</span>
        <span className="text-brand-light font-semibold bg-slate-700 px-2 py-1 rounded-md">{value}{unit}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-secondary [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:ease-in-out [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:bg-brand-light"
      />
    </div>
  );
};

export default Slider;
