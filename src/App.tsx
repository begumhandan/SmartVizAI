import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ChartGrid } from './components/ChartGrid';
import { Sidebar } from './components/Sidebar';
import { generateSuggestions, type ChartSuggestion } from './lib/analyzer';
import { analyzeImage, type VisionAnalysisResult } from './lib/vision';
import { Sparkles, ScanEye, ArrowRight } from 'lucide-react';

function App() {
  const [data, setData] = useState<any[] | null>(null);
  const [suggestions, setSuggestions] = useState<ChartSuggestion[]>([]);
  const [fileName, setFileName] = useState<string>("");

  // Image State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<VisionAnalysisResult | null>(null);
  const [isVisionAnalyzing, setIsVisionAnalyzing] = useState(false);

  const handleDataLoaded = (jsonData: any[], name: string) => {
    setData(jsonData);
    setFileName(name);
    const newSuggestions = generateSuggestions(jsonData);
    setSuggestions(newSuggestions);
    // Clear image state
    setUploadedImage(null);
    setVisionResult(null);
  };

  const handleImageLoaded = async (file: File) => {
    // Show image immediately
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    setFileName(file.name);
    setData(null); // Clear previous data view if any
    setIsVisionAnalyzing(true);

    // Run vision analysis
    const result = await analyzeImage(file);
    setVisionResult(result);
    setIsVisionAnalyzing(false);

    // Generate suggestions from synthetic data
    const newSuggestions = generateSuggestions(result.generatedData);
    setSuggestions(newSuggestions);
  };

  const handleNewChat = () => {
    setData(null);
    setSuggestions([]);
    setFileName("");
    setUploadedImage(null);
    setVisionResult(null);
    setIsVisionAnalyzing(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar onNewChat={handleNewChat} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative">
        <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 md:py-12 md:px-8">
          {!data && !uploadedImage ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in-95 duration-700">
              <div className="w-full max-w-2xl text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-sm font-medium text-blue-400 mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Visualization Interface</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-4 leading-tight">
                  What would you like to <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    visualize today?
                  </span>
                </h1>
                <p className="text-lg text-slate-500 max-w-lg mx-auto">
                  Upload your dataset (Excel/CSV) OR a Chart Image to analyze and convert.
                </p>
              </div>

              <FileUpload onDataLoaded={handleDataLoaded} onImageLoaded={handleImageLoaded} />
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Analysis Results</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Source: <span className="text-blue-400 font-mono">{fileName}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleNewChat} className="text-sm text-slate-500 hover:text-white transition-colors">
                    Start Over
                  </button>
                </div>
              </div>

              {/* Image Analysis Section */}
              {uploadedImage && (
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 mb-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-slate-700 shadow-xl">
                      <img src={uploadedImage} alt="Uploaded Analysis" className="w-full h-auto" />
                      {isVisionAnalyzing && (
                        <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-2">
                            <ScanEye className="w-8 h-8 text-blue-400 animate-pulse" />
                            <span className="text-sm font-medium text-blue-300">Scanning Chart...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {visionResult && !isVisionAnalyzing && (
                      <div className="flex-1 space-y-4 animate-in slide-in-from-right-4 duration-500">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-bold">
                          <ScanEye className="w-4 h-4" />
                          Detected: {visionResult.detectedType}
                        </div>

                        <h3 className="text-xl font-semibold text-white">Conversion Options Available</h3>
                        <p className="text-slate-400">
                          We've extracted the underlying data structure from your image.
                          You can now visualize this data in {suggestions.length} other formats below.
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{visionResult.generatedData.length}</div>
                            <div className="text-xs text-slate-500 uppercase">Data Points</div>
                          </div>
                          <div className="w-px h-8 bg-slate-800" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{(visionResult.confidence * 100).toFixed(0)}%</div>
                            <div className="text-xs text-slate-500 uppercase">Confidence</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(suggestions.length > 0 && (!uploadedImage || visionResult)) && (
                <>
                  {uploadedImage && <div className="flex items-center gap-2 text-lg font-semibold text-white mb-4"><ArrowRight className="w-5 h-5 text-blue-500" /> Recommended Conversions</div>}
                  <ChartGrid suggestions={suggestions} />
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
