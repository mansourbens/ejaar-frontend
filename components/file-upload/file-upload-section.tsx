import React, { useState } from 'react';
import { DocumentSection, UploadFile } from '@/types/file-upload';
import FileUploadItem from './file-upload-item';
import { ChevronDown, ChevronUp, Folder } from 'lucide-react';
import {useAuth} from "@/components/auth/auth-provider";

interface FileUploadSectionProps {
    section: DocumentSection;
    quotationId: string,
    onFileUpload: (sectionId: string, documentTypeId: string, file: UploadFile) => void;
    onFileRemove: (sectionId: string, documentTypeId: string) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
                                                                 section,
                                                                 quotationId,
                                                                 onFileUpload,
                                                                 onFileRemove
                                                             }) => {
    const [isExpanded, setIsExpanded] = useState(false);
        const {user} = useAuth()
    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleFileUpload = (documentTypeId: string, file: UploadFile) => {
        onFileUpload(section.id, documentTypeId, file);
    };

    const handleFileRemove = (documentTypeId: string) => {
        onFileRemove(section.id, documentTypeId);
    };

    // Calculate progress for this section
    const totalDocuments = section.documentTypes.length;
    const uploadedDocuments = section.documentTypes.filter(
        doc => doc.uploadedFile?.status === 'success'
    ).length;

    const progress = totalDocuments > 0
        ? Math.round((uploadedDocuments / totalDocuments) * 100)
        : 0;

    return (
        <div className="section-card text-left  mb-6 animate-slide-up"
           >
                <div className="section-title cursor-pointer"
                     onClick={toggleExpanded}
                     aria-expanded={isExpanded}>
                    <Folder className="text-blue-600" size={20} />
                    <span>{section.title} {section.id != 'section-4' && <span className="text-red-600">*</span>}</span>
                    <div className="ml-auto flex items-center gap-3">
                        <div className="text-sm text-blue-600 font-medium">
                            {uploadedDocuments}/{totalDocuments}
                        </div>
                        {isExpanded ? (
                            <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                        )}
                    </div>
            </div>

            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {section.documentTypes.map((documentType) => (
                        <FileUploadItem
                            key={documentType.id}
                            documentType={documentType}
                            quotationId={quotationId}
                            onFileUpload={handleFileUpload}
                            onFileRemove={handleFileRemove}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUploadSection;
