
import React, { useState } from 'react';
import Header from './components/Header';
import ImageEditor from './components/ImageEditor';
import ImageGenerator from './components/ImageGenerator';
import ImageAnalyzer from './components/ImageAnalyzer';
import TabButton from './components/TabButton';

type Tab = 'edit' | 'generate' | 'analyze';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('edit');

  const renderContent = () => {
    switch (activeTab) {
      case 'edit':
        return <ImageEditor />;
      case 'generate':
        return <ImageGenerator />;
      case 'analyze':
        return <ImageAnalyzer />;
      default:
        return <ImageEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-8 flex justify-center border-b border-slate-700">
            <TabButton 
              label="Image Editor" 
              isActive={activeTab === 'edit'} 
              onClick={() => setActiveTab('edit')} 
            />
            <TabButton 
              label="Image Generator" 
              isActive={activeTab === 'generate'} 
              onClick={() => setActiveTab('generate')} 
            />
            <TabButton 
              label="Image Analyzer" 
              isActive={activeTab === 'analyze'} 
              onClick={() => setActiveTab('analyze')} 
            />
          </div>
          {renderContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>&copy; 2024 Qwen Image Tools. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
