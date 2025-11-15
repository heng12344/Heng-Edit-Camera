
import React, { useState, useEffect, useCallback } from 'react';
import Slider from './Slider';
import { editImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';

const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [verticalAngle, setVerticalAngle] = useState(0);
  
  const [prompt, setPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOriginalImage(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setGeneratedImageUrl(null);
      setError(null);
    }
  };

  const generatePrompt = useCallback(() => {
    let parts = ["Re-render this image with the following camera adjustments."];

    if (rotation !== 0) {
      parts.push(`Rotate the camera perspective ${rotation > 0 ? 'right' : 'left'} by ${Math.abs(rotation)} degrees.`);
    }

    if (zoom > 1) {
      let zoomDesc = "slightly";
      if (zoom > 1.3) zoomDesc = "moderately";
      if (zoom > 1.7) zoomDesc = "significantly";
      parts.push(`Move the camera forward for a ${zoomDesc} close-up, approximately ${zoom.toFixed(1)}x zoom.`);
    }

    if (verticalAngle !== 0) {
      if (verticalAngle > 30) {
        parts.push(`Change to a high vertical angle for a bird's-eye view.`);
      } else if (verticalAngle < -30) {
        parts.push(`Change to a low vertical angle for a worm's-eye view.`);
      } else {
        parts.push(`Adjust the vertical camera angle ${verticalAngle > 0 ? 'upwards' : 'downwards'} by ${Math.abs(verticalAngle)} degrees.`);
      }
    }
    
    if (parts.length === 1) {
      parts.push("Maintain the original camera perspective.");
    }
    
    setPrompt(parts.join(' '));
  }, [rotation, zoom, verticalAngle]);

  useEffect(() => {
    generatePrompt();
  }, [generatePrompt]);

  const handleGenerateClick = async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const base64Image = await fileToBase64(originalImage);
      const generatedData = await editImage(base64Image, originalImage.type, prompt);
      setGeneratedImageUrl(`data:image/png;base64,${generatedData}`);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const ImagePlaceholder: React.FC<{ onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; children?: React.ReactNode, label: string }> = ({ onUpload, children, label }) => (
    <div className="relative w-full aspect-square bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex flex-col justify-center items-center text-slate-500 hover:border-brand-secondary hover:text-brand-light transition-colors duration-300">
      {children || (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-semibold">{label}</p>
          <p className="text-xs">Click or drag to upload</p>
        </>
      )}
      <input type="file" accept="image/*" onChange={onUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6 bg-slate-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold text-brand-light border-b border-slate-700 pb-2">Camera Controls</h2>
        <Slider label="Rotate Left/Right" value={rotation} min={-90} max={90} step={5} onChange={(e) => setRotation(parseInt(e.target.value))} unit="°" />
        <Slider label="Move Forward (Zoom)" value={zoom} min={1} max={2} step={0.1} onChange={(e) => setZoom(parseFloat(e.target.value))} unit="x" />
        <Slider label="Vertical Angle" value={verticalAngle} min={-90} max={90} step={10} onChange={(e) => setVerticalAngle(parseInt(e.target.value))} unit="°" />
        <div className="border-t border-slate-700 pt-6 space-y-4">
          <div className="relative">
            <button onClick={() => setShowPrompt(!showPrompt)} className="w-full text-left bg-slate-700 hover:bg-slate-600 p-3 rounded-md transition-colors text-sm font-mono truncate">
              {prompt}
            </button>
            {showPrompt && (
              <div className="absolute z-10 bottom-full mb-2 w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm font-mono shadow-lg animate-fade-in-up">
                {prompt}
              </div>
            )}
          </div>
          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !originalImage}
            className="w-full bg-brand-secondary hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/50"
          >
            {isLoading && <Spinner />}
            <span>{isLoading ? 'Generating...' : 'Apply Transformation'}</span>
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
      </div>

      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImagePlaceholder onUpload={handleImageUpload} label="Upload Original Image">
          {originalImageUrl && <img src={originalImageUrl} alt="Original" className="w-full h-full object-contain rounded-lg" />}
        </ImagePlaceholder>
        
        <div className="relative w-full aspect-square bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex justify-center items-center text-slate-500">
            {isLoading ? <Spinner /> : generatedImageUrl ? 
              <img src={generatedImageUrl} alt="Generated" className="w-full h-full object-contain rounded-lg" /> :
              <p>Generated image will appear here</p>
            }
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
