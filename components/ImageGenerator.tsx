
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './Spinner';
import { AspectRatio } from '../types';

const aspectRatios: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const imageData = await generateImage(prompt, aspectRatio);
      setGeneratedImageUrl(`data:image/png;base64,${imageData}`);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3 space-y-6 bg-slate-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold text-brand-light border-b border-slate-700 pb-2">Image Generation</h2>
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">Prompt</label>
          <textarea
            id="prompt"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
            placeholder="e.g., A photorealistic image of a cat wearing sunglasses"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {aspectRatios.map(ar => (
              <button
                key={ar}
                onClick={() => setAspectRatio(ar)}
                className={`py-2 px-3 rounded-md text-sm transition-colors ${aspectRatio === ar ? 'bg-brand-secondary text-white font-bold' : 'bg-slate-700 hover:bg-slate-600'}`}
              >
                {ar}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="w-full bg-brand-secondary hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/50"
        >
          {isLoading && <Spinner />}
          <span>{isLoading ? 'Generating...' : 'Generate Image'}</span>
        </button>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>

      <div className="md:w-2/3 flex-grow flex justify-center items-center bg-slate-800 rounded-lg p-4 border-2 border-dashed border-slate-600 min-h-[300px] md:min-h-0">
        {isLoading ? <Spinner /> : generatedImageUrl ?
          <img src={generatedImageUrl} alt="Generated" className="max-w-full max-h-full object-contain rounded-md" /> :
          <p className="text-slate-500 text-center">Your generated image will appear here</p>
        }
      </div>
    </div>
  );
};

export default ImageGenerator;
