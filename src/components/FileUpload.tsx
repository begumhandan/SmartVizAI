import { useState, useCallback } from 'react';
import { read, utils } from 'xlsx';
import { Upload, Paperclip, ArrowRight, CheckCircle, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
    onDataLoaded: (data: any[], fileName: string) => void;
    onImageLoaded?: (file: File) => void;
    className?: string;
}

export function FileUpload({ onDataLoaded, onImageLoaded, className }: FileUploadProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState<string>("");

    const processFile = useCallback(async (file: File) => {
        setIsProcessing(true);
        setFileName(file.name);

        // Check if image
        if (file.type.startsWith('image/')) {
            if (onImageLoaded) {
                // Slight delay for UI effect
                setTimeout(() => {
                    onImageLoaded(file);
                    setIsProcessing(false);
                }, 800);
                return;
            }
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = read(arrayBuffer);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet);

            // Simulate analysis delay
            setTimeout(() => {
                onDataLoaded(jsonData, file.name);
                setIsProcessing(false);
            }, 1200);

        } catch (error) {
            console.error("Error reading file:", error);
            setIsProcessing(false);
            setFileName("");
        }
    }, [onDataLoaded, onImageLoaded]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className={cn("w-full max-w-3xl mx-auto", className)}>
            <div className="relative group">
                <label
                    htmlFor="file-upload"
                    className={cn(
                        "relative flex items-center gap-4 w-full p-4 rounded-2xl border transition-all duration-300 cursor-text",
                        isProcessing
                            ? "bg-slate-900 border-blue-500/50 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]"
                            : "bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 shadow-xl"
                    )}
                >
                    <div className="flex items-center justify-center p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors">
                        {isProcessing ? <FileText className="w-5 h-5 animate-pulse" /> : <Paperclip className="w-5 h-5" />}
                    </div>

                    <div className="flex-1">
                        {fileName ? (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-200">{fileName}</span>
                                <span className="text-xs text-blue-400">{isProcessing ? "Analyzing dataset..." : "Ready"}</span>
                            </div>
                        ) : (
                            <input
                                disabled
                                placeholder="Type a command or upload images/datasets..."
                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-300 placeholder:text-slate-500 text-sm"
                            />
                        )}
                    </div>

                    <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                        isProcessing ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500 group-hover:bg-blue-600 group-hover:text-white cursor-pointer"
                    )}>
                        {isProcessing ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <ArrowRight className="w-4 h-4" />
                        )}
                    </div>

                    <input
                        type="file"
                        id="file-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".csv, .xlsx, .xls, .png, .jpg, .jpeg"
                        onChange={handleChange}
                        disabled={isProcessing}
                    />
                </label>
            </div>

            {!fileName && (
                <div className="flex justify-center gap-4 mt-6">
                    <span className="px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer">
                        Try "Analyze sales trends"
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer">
                        Try "Show correlation map"
                    </span>
                </div>
            )}
        </div>
    );
}
