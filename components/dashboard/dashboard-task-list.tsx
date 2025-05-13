import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface TaskItem {
    id: string;
    number: string;
    clientName: string;
    amount: number;
    status: string;
    createdAt: string;
}

interface DashboardTaskListProps {
    title: string;
    description: string;
    items: TaskItem[];
    emptyMessage: string;
    statusColor: string;
    icon: ReactNode;
}

const DashboardTaskList = ({
                               title,
                               description,
                               items,
                               emptyMessage,
                               statusColor,
                               icon,
                           }: DashboardTaskListProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <Card className="border-blue-200 shadow-md">
            <CardHeader>
                <CardTitle className="text-blue-800">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-4 border border-blue-100 rounded-lg transition-colors hover:bg-blue-50"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-full ${statusColor}`}>
                                        {icon}
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.number}</p>
                                        <p className="text-sm text-blue-700">{item.clientName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <p className="font-medium text-right">{formatCurrency(item.amount)}</p>
                                        <p className="text-sm text-blue-600">
                                            {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <Link href={`/quotations/${item.id}`}>
                                        <Button variant="ghost" size="icon" className="hover:bg-blue-100 text-blue-600">
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {items.length > 0 && (
                    <div className="mt-4 flex justify-end">
                        <Link href="/quotations">
                            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                Voir tout
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DashboardTaskList;
