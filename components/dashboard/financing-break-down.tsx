import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FilePen, FileCheck } from "lucide-react";
import { formatCurrency } from '@/lib/utils';

interface FinancingBreakdownProps {
    devisAmount: number;
    dossierAmount: number;
    contratAmount: number;
}

interface FinancingBlockProps {
    title: string;
    amount: number;
    icon: React.ReactNode;
    description: string;
    color: string;
}

const FinancingBlock: React.FC<FinancingBlockProps> = ({
                                                           title,
                                                           amount,
                                                           icon,
                                                           description,
                                                           color,
                                                       }) => (
    <div className={`p-4 border border-${color}-200 rounded-lg bg-${color}-50 mb-2 last:mb-0`}>
        <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}>
                {icon}
            </div>
            <h4 className="font-medium text-blue-800">{title}</h4>
        </div>
        <div className="ml-12">
            <p className="text-lg font-bold text-blue-900">
                {formatCurrency(amount)}
            </p>
            <p className="text-xs text-gray-600">{description}</p>
        </div>
    </div>
);

const FinancingBreakdown: React.FC<FinancingBreakdownProps> = ({
                                                                   devisAmount,
                                                                   dossierAmount,
                                                                   contratAmount
                                                               }) => {
    return (
        <Card
            className="border-blue-200 shadow-md h-full"
        >
            <CardHeader>
                <CardTitle className="text-blue-800">Détails du financement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <FinancingBlock
                    title="Vision Devis"
                    amount={devisAmount}
                    icon={<FileText className="h-5 w-5" />}
                    description="Montant des devis en attente"
                    color="blue"
                />

                <FinancingBlock
                    title="Dossiers à Compléter"
                    amount={dossierAmount}
                    icon={<FilePen className="h-5 w-5" />}
                    description="Dossiers à finaliser"
                    color="amber"
                />

                <FinancingBlock
                    title="Contrats à Sortir"
                    amount={contratAmount}
                    icon={<FileCheck className="h-5 w-5" />}
                    description="Contrats à établir"
                    color="emerald"
                />
            </CardContent>
        </Card>
    );
};

export default FinancingBreakdown;
