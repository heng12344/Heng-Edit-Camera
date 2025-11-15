
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-10">
      <div className="container mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-light tracking-tight">
          Qwen Image Edit
        </h1>
        <p className="text-sm text-slate-400">AI-Powered Camera Angle Control</p>
      </div>
    </header>
  );
};

export default Header;
