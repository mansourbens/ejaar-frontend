import React, {useRef, useState} from 'react';
import {DocumentType, ServerFile, UploadFile} from '@/types/file-upload';
import {Button} from '@/components/ui/button';
import {Check, CheckCircle, DeleteIcon, File, FileText, Info, Trash2Icon, Undo2Icon, Upload, X} from 'lucide-react';
import {formatFileSize, generateId, validateFile} from '@/lib/file-utils';
import {useToast} from "@/hooks/use-toast";
import UploadProgress from "@/components/file-upload/upload-progress";
import {fetchWithTokenWithoutContentType, UserRole} from "@/lib/utils";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useAuth} from "@/components/auth/auth-provider";
import {FileStatusEnum} from "@/components/quotations/quotation-verification-step";

interface FileUploadItemProps {
    documentType: DocumentType;
    quotationId: string,
    onFileUpload: (documentTypeId: string, file: UploadFile) => void;
    onFileRemove: (documentTypeId: string) => void;
    isDeleteHidden: boolean,
    isRectification: boolean,
    onRectifFile?: () => void;
}

const FileUploadItem: React.FC<FileUploadItemProps> = ({
                                                           documentType,
                                                           quotationId,
                                                           onFileUpload,
                                                           onFileRemove,
                                                           isDeleteHidden, isRectification,
    onRectifFile
                                                       }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const rectifFileInputRef = useRef<HTMLInputElement>(null);
    const {toast} = useToast();
    const [isFileRemoveOpen, setIsFileRemoveOpen] = useState(false);
    const [rectifUploadedFile, setRectifUploadFile] = useState<UploadFile | null>(null);

    const {id, name, uploadedFile} = documentType;

    const {user} = useAuth();
    const handleValidate = async () => {
        try {
            await fetchWithTokenWithoutContentType(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/validate/${uploadedFile?.id}`, {
                method: 'GET',
            });
            toast({
                title: 'Document validé',
                description: `Le document ${uploadedFile?.file.originalName} a été validé avec succès.`,
            });
            uploadedFile.file.status = FileStatusEnum.VERIFE;
        } catch {
            toast({
                title: 'Erreur de validation',
                description: 'Une erreur est survenue lors de la validation.',
                variant: 'destructive',
            });
        } finally {
            setIsValidationDialogOpen(false);
        }
    };

    const handleReject = async () => {
        try {
            await fetchWithTokenWithoutContentType(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/reject/${uploadedFile?.id}`, {
                method: 'POST',
                body: JSON.stringify({rejectionReason}),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            uploadedFile.file.status = FileStatusEnum.A_RECTIFIER;
            toast({
                title: 'Document rejeté',
                description: `Le document ${uploadedFile?.file.name} a été rejeté.`,
            });
        } catch {
            toast({
                title: 'Erreur de rejet',
                description: 'Une erreur est survenue lors du rejet.',
                variant: 'destructive',
            });
        } finally {
            setIsRejectionDialogOpen(false);
            setRejectionReason('');
        }
    };

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
    const handleRectifFileSelect = async (file: File) => {
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
            status: 'success',
            progress: 100
        };
        setRectifUploadFile(newFile);
    }

    const sendRectifFile = async (file: File) => {
        try {
            console.log('upload...');
            const formData = new FormData();
            formData.append('file', file as File);
            formData.append('rectification', 'true');
            formData.append('documentType', uploadedFile.file.documentType);
            formData.append('quotationId', quotationId);

            const response = await fetchWithTokenWithoutContentType(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) throw new Error('Upload failed');
            if(onRectifFile) {
                onRectifFile();
            }

        } catch (error) {
        }
    }
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
    const handleRectrifInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('input');
        const file = e.target.files?.[0];
        if (file) {
            handleRectifFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleRectifFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleRectifFileSelect(file);
        }
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const triggerRectifFileInput = (event: any) => {
        event.stopPropagation();
        rectifFileInputRef.current?.click();
    };
    const triggerFileInput = (event: any) => {
        event.stopPropagation();
        fileInputRef.current?.click();
    };
    const validateRectificationFile = () => {
        console.log('rectif send');
        sendRectifFile(rectifUploadedFile?.file as File);

    }
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
                        {uploadedFile?.status === 'success' && user?.role.name === UserRole.SUPER_ADMIN && uploadedFile.file.status === FileStatusEnum.EN_VERIFICATION && (
                            <div className="flex mt-2 gap-2">
                                <Button
                                    size="sm"
                                    className="bg-ejaar-green hover:bg-ejaar-greenHover text-white"
                                    onClick={() => setIsValidationDialogOpen(true)}
                                >
                                    <Check className="mr-2 h-4 w-4"/>
                                    Valider
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-ejaar-red hover:bg-ejaar-redHover text-white"
                                    onClick={() => setIsRejectionDialogOpen(true)}
                                >
                                    <X className="mr-2 h-4 w-4"/>
                                    Refuser
                                </Button>
                            </div>
                        )}
                        {uploadedFile.file.status === FileStatusEnum.VERIFE &&
                            <div className="text-ejaar-green flex gap-2 items-center mt-2">
                                <CheckCircle className="h-3 w-3"></CheckCircle>
                                <span>Verifié</span>
                            </div>
                        }
                        {uploadedFile.file.status === FileStatusEnum.A_RECTIFIER &&
                            <>
                                <div className="text-amber-600 flex gap-2 items-center mt-2">
                                    <Undo2Icon className="h-3 w-3"></Undo2Icon>
                                    <span>En vérification</span>
                                </div>
                                <span
                                    className="text-sm text-ejaar-700">Info : {uploadedFile.file?.rejectionReason}</span>
                            </>
                        }
                        {uploadedFile && user?.role.name === UserRole.CLIENT && uploadedFile.file.status === FileStatusEnum.A_RECTIFIER && (
                            <div>
                                <p className="text-ejaar-700">Nouveau document</p>
                                {rectifUploadedFile ?
                                    <div
                                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-md "
                                    >
                                        <div className="shrink-0">
                                            <File size={20} className="text-blue-600"/>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-sm font-medium text-gray-700 truncate">
                                                {'originalName' in rectifUploadedFile.file
                                                    ? rectifUploadedFile.file.originalName
                                                    : rectifUploadedFile.file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(
                                                    rectifUploadedFile.file.size
                                                )}
                                            </p>
                                        </div>
                                        {rectifUploadedFile.status === 'success' && (
                                            <div className="shrink-0">
                                                <div
                                                    className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check size={14} className="text-green-600"/>
                                                </div>
                                            </div>
                                        )}
                                    <div/>
                                    </div>:
                                    <>

                                        <input
                                            type="file"
                                            ref={rectifFileInputRef}
                                            onChange={handleRectrifInputChange}
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                        <div
                                            className={`file-input-label ${isDragging ? 'border-blue-500 bg-blue-50' : ''}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={(event) => triggerRectifFileInput(event)}
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
                                    </>
                                }
                                {rectifUploadedFile && <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-ejaar-green hover:bg-ejaar-greenHover text-white"
                                        onClick={validateRectificationFile}
                                    >
                                        <Check className="mr-2 h-4 w-4"/>
                                        Valider
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-ejaar-red hover:bg-ejaar-redHover text-white"
                                        onClick={() => setRectifUploadFile(null)}
                                    >
                                        <X className="mr-2 h-4 w-4"/>
                                        Annuler
                                    </Button>
                                </div>}

                            </div>)}

                        {user?.role.name !== UserRole.SUPER_ADMIN &&
                            <UploadProgress
                                status={uploadedFile.status}
                                progress={uploadedFile.progress}
                                error={uploadedFile.error}
                            />
                        }


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
            <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg border border-red-100 shadow-xl">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-red-50">
                                <Trash2Icon className="h-5 w-5 text-red-600"/>
                            </div>
                            <DialogTitle className="text-red-900 text-lg font-semibold">
                                Rejet du document
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="py-2 px-2 space-y-2">
                        <label htmlFor="rejectionReason" className="text-sm text-gray-700">Raison du rejet</label>
                        <textarea
                            id="rejectionReason"
                            rows={4}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Expliquez la raison du rejet..."
                        />
                    </div>

                    <DialogFooter className="sm:justify-between">
                        <Button variant="outline"
                                onClick={() => setIsRejectionDialogOpen(false)}
                                className="border-blue-200 text-gray-700 hover:bg-blue-50">
                            Annuler
                        </Button>
                        <Button
                            onClick={handleReject}
                            className="bg-red-800 hover:bg-red-700 text-white shadow-sm"
                        >
                            <CheckCircle className="mr-2 h-4 w-4"/>
                            Confirmer le rejet
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isValidationDialogOpen} onOpenChange={setIsValidationDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg border border-blue-100 shadow-xl">

                    <DialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-50">
                                <FileText className="h-5 w-5 text-blue-600"/>
                            </div>
                            <DialogTitle className="text-blue-900 text-lg font-semibold">
                                Validation du document {uploadedFile?.file.originalName}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <DialogFooter className="sm:justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setIsValidationDialogOpen(false)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleValidate}
                            className="bg-ejaar-800 hover:bg-ejaar-700 text-white shadow-sm"
                        >
                            <CheckCircle className="mr-2 h-4 w-4"/>
                            Confirmer la validation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    )
        ;
};

export default FileUploadItem;
