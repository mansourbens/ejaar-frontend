import {Quotation} from "@/lib/mock-data";

export interface Contract {
    id: string;

    filename: string;

    originalName: string;

    path: string;

    size: number;

    mimetype: string;

    uploadedAt: Date;

    signed: boolean;
}
