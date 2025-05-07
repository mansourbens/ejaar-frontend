
// Simulates a file upload with progress
import {UploadFile} from "@/types/file-upload";

export const uploadFile = async (
    file: File,
    onProgress: (progress: number) => void
): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("No file provided"));
            return;
        }

        // Simulate network delay and progress updates
        let progress = 0;
        const totalTime = 2500; // 2.5 seconds for simulated upload
        const interval = 100; // Update progress every 100ms
        const steps = totalTime / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            progress += increment;
            onProgress(Math.min(progress, 100));

            if (progress >= 100) {
                clearInterval(timer);
                // Simulate successful upload with file URL
                setTimeout(() => {
                    resolve(`https://api.example.com/files/${Date.now()}-${file.name}`);
                }, 300);
            }
        }, interval);
    });
};

// Format file size to a human-readable format
export const formatFileSize = (bytes: number): string => {
    if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
        return 'Unknown size';
    }
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate a unique ID for files
export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Validate file (can be extended with more checks)
export const validateFile = (file: File, maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } => {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File is too large. Maximum size is ${formatFileSize(maxSize)}`
        };
    }

    return { valid: true };
};
