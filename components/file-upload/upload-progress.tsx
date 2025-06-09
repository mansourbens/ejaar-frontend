import React from 'react';
import { Progress } from "@/components/ui/progress";
import { FileStatus } from '@/types/file-upload';
import { Check, X } from 'lucide-react';

interface UploadProgressProps {
    status: FileStatus;
    progress: number;
    error?: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ status, progress, error }) => {
    if (status === 'idle') {
        return null;
    }

    return (
        <div className="mt-2 space-y-1 animate-fade-in">
            {status === 'uploading' && (
                <div className="space-y-1">
                    <div className="flex justify-between text-sm text-blue-700">
                        <span>Uploading...</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-ejaar-100" />
                </div>
            )}

            {status === 'success' && (
                <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <Check size={16} className="shrink-0" />
                    <span>Téléchargé avec succès</span>
                </div>
            )}

            {status === 'error' && (
                <div className="flex items-center gap-1.5 text-sm text-red-600 font-medium">
                    <X size={16} className="shrink-0" />
                    <span>{error || 'Upload failed'}</span>
                </div>
            )}
        </div>
    );
};

export default UploadProgress;
