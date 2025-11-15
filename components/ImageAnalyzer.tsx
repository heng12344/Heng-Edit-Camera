
import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';

const ImageAnalyzer: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [useProModel, setUseProModel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await analyzeImage(base64Image, imageFile.type, useProModel);
      setAnalysisResult(result);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="relative w-full aspect-video bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex flex-col justify-center items-center text-slate-500 hover:border-brand-secondary hover:text-brand-light transition-colors duration-300">
          {imageUrl ? (
            <img src={imageUrl} alt="For analysis" className="w-full h-full object-contain rounded-lg p-2" />
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-semibold">Upload Image to Analyze</p>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <input type="checkbox" id="pro-model" checked={useProModel} onChange={() => setUseProModel(!useProModel)} className="h-5 w-5 rounded bg-slate-700 border-slate-500 text-brand-secondary focus:ring-brand-secondary"/>
                <label htmlFor="pro-model" className="font-medium text-slate-300">Use Thinking Mode (Gemini Pro)</label>
            </div>
            <button
            onClick={handleAnalyze}
            disabled={isLoading || !imageFile}
            className="bg-brand-secondary hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
            >
            {isLoading && <Spinner/>}
            <span>Analyze</span>
            </button>
        </div>
        {error && <p className="text-red-400 text-sm text-center -mt-4">{error}</p>}
      </div>

      <div className="bg-slate-800/50 p-6 rounded-lg shadow-xl">
        <h3 className="text-xl font-bold text-brand-light mb-4 border-b border-slate-700 pb-2">Analysis Result</h3>
        <div className="prose prose-invert prose-sm max-w-none h-96 overflow-y-auto pr-2">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Spinner/>
                </div>
            ) : analysisResult ? (
                <p>{analysisResult}</p>
            ) : (
                <p className="text-slate-400">Analysis from Gemini will appear here.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;
