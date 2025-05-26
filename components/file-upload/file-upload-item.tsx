import React, {useRef, useState} from 'react';
import {DocumentType, UploadFile} from '@/types/file-upload';
import {Button} from '@/components/ui/button';
import {Check, CheckCircle, DeleteIcon, File, Info, Trash2Icon, Upload, X} from 'lucide-react';
import {formatFileSize, generateId, validateFile} from '@/lib/file-utils';
import {useToast} from "@/hooks/use-toast";
import UploadProgress from "@/components/file-upload/upload-progress";
import {fetchWithTokenWithoutContentType, UserRole} from "@/lib/utils";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useAuth} from "@/components/auth/auth-provider";

interface FileUploadItemProps {
    documentType: DocumentType;
    quotationId: string,
    onFileUpload: (documentTypeId: string, file: UploadFile) => void;
    onFileRemove: (documentTypeId: string) => void;
    isDeleteHidden: boolean
}

const FileUploadItem: React.FC<FileUploadItemProps> = ({
                                                           documentType,
                                                           quotationId,
                                                           onFileUpload,
                                                           onFileRemove,
                                                           isDeleteHidden
                                                       }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {toast} = useToast();
    const [isFileRemoveOpen, setIsFileRemoveOpen] = useState(false);

    const {id, name, uploadedFile} = documentType;

    const {user} = useAuth();
    const handleDownload = () => {
        if (!uploadedFile) return;

        if ('url' in uploadedFile.file) {
            // Server file - open in new tab
            window.open(uploadedFile.file.url, '_blank');
        } else {
            // Client file - create download link
            const url = URL.createObjectURL(uploadedFile.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = uploadedFile.file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };
    const handleFileSelect = async (file: File) => {
        const validation = validateFile(file);

        if (!validation.valid) {
            toast({
                title: "Erreur d'upload",
                description: validation.error,
                variant: "destructive",
            });
            return;
        }

        const newFile: UploadFile = {
            id: generateId(),
            file,
            status: 'uploading',
            progress: 0
        };

        onFileUpload(id, newFile);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('documentType', id);
            formData.append('originalName', file.name);
            formData.append('quotationId', quotationId);
            await fetchWithTokenWithoutContentType(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            onFileUpload(id, {
                ...newFile,
                status: 'success',
                progress: 100
            });

            toast({
                title: "Upload Terminé",
                description: `Le document ${file.name} a été uploadé avec succès.`,
            });
        } catch (error) {
            const errorMessage = 'Une erreur est survenue';

            onFileUpload(id, {
                ...newFile,
                status: 'error',
                progress: 0,
                error: errorMessage
            });

            toast({
                title: "Upload échoué",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('input');
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const triggerFileInput = (event: any) => {
        event.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        onFileRemove(id);
        setIsFileRemoveOpen(false);
    };

    return (
        <div className="file-card mb-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">{name}</h3>
                {uploadedFile?.status === 'success' && user?.role.name === UserRole.CLIENT && !isDeleteHidden && (
                    <button
                        type="button"
                        onClick={() => setIsFileRemoveOpen(true)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove file"
                    >
                        <X size={18}/>
                    </button>
                )}
            </div>

            {<>
                {!uploadedFile ? (
                    <>
                        {user?.role.name === UserRole.CLIENT && (<>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleInputChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <div
                                className={`file-input-label ${isDragging ? 'border-blue-500 bg-blue-50' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={(event) => triggerFileInput(event)}
                            >
                                <Upload
                                    size={24}
                                    className="text-blue-500 mb-2"
                                />
                                <p className="text-sm text-center text-gray-500">
                                    <span className="font-semibold text-blue-600">Cliquer pour uploader</span> ou
                                    glisser
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    PDF, DOCX, JPG, PNG (Max 10MB)
                                </p>
                            </div>
                        </>)}
                    </>
                ) : (
                    <div className="mt-2">
                        <div
                            className="flex items-center gap-3 p-3 bg-blue-50 rounded-md cursor-pointer hover:bg-blue-100"
                            onClick={handleDownload}
                        >
                            <div className="shrink-0">
                                <File size={20} className="text-blue-600"/>
                            </div>
                            {uploadedFile && <>
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                        {'originalName' in uploadedFile.file
                                            ? uploadedFile.file.originalName
                                            : uploadedFile.file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(
                                            uploadedFile.file.size
                                        )}
                                    </p>
                                </div>
                                {uploadedFile.status === 'success' && (
                                    <div className="shrink-0">
                                        <div
                                            className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check size={14} className="text-green-600"/>
                                        </div>
                                    </div>
                                )}
                            </>}

                        </div>

                        <UploadProgress
                            status={uploadedFile.status}
                            progress={uploadedFile.progress}
                            error={uploadedFile.error}
                        />

                        {uploadedFile.status === 'error' && (
                            <Button
                                className="mt-2 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                                onClick={triggerFileInput}
                            >
                                Réessayer
                            </Button>
                        )}
                    </div>
                )
                }
            </>}

            <Dialog open={isFileRemoveOpen} onOpenChange={setIsFileRemoveOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg border border-blue-100 shadow-xl">

                    <DialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-red-50">
                                <Trash2Icon className="h-5 w-5 text-red-600"/>
                            </div>
                            <DialogTitle className="text-red-900 text-lg font-semibold">
                                Suppression de document
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="py-4 px-2">
                        <div className="flex items-start p-4 border border-red-100 rounded-lg bg-red-50">
                            <Info className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0"/>
                            <p className="ml-2 text-sm text-red-700">
                                Êtes-vous sûr de vouloir supprimer de document ?
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setIsFileRemoveOpen(false)}
                            className="border-blue-200 text-gray-700 hover:bg-blue-50"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleRemove}
                            className="bg-red-800 hover:bg-red-700 text-white shadow-sm"
                        >
                            <CheckCircle className="mr-2 h-4 w-4"/>
                            Oui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    )
        ;
};

export default FileUploadItem;
