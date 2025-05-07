export type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface ServerFile {
    id: string;
    filename: string;
    originalName: string;
    documentType: string;
    size: number;
    uploadedAt: Date;
    url: string;
}

export interface UploadFile {
    id: string;
    file: File | ServerFile;
    status: FileStatus;
    progress: number;
    error?: string;
}

export interface DocumentType {
    id: string;
    name: string;
    uploadedFile?: UploadFile;
}

export interface DocumentSection {
    id: string;
    title: string;
    documentTypes: DocumentType[];
}

export interface DocumentUploadState {
    sections: DocumentSection[];
}
