
import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  const baseClasses = "px-4 py-2 text-sm sm:text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-brand-secondary rounded-t-lg";
  const activeClasses = "text-brand-secondary border-b-2 border-brand-secondary";
  const inactiveClasses = "text-slate-400 hover:text-white hover:bg-slate-800/50";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};

export default TabButton;
