'use client';

import { motion } from 'framer-motion';
import { Server, Laptop, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EquipmentCardProps {
    title: string;
    description: string;
}

export function EquipmentCard({ title, description }: EquipmentCardProps) {
    const getIcon = (title: string) => {
        if (title.includes('Serveurs')) return Server;
        if (title.includes('Workstations')) return Laptop;
        return Smartphone;
    };

    const Icon = getIcon(title);

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="relative overflow-hidden bg-white/10 p-6 backdrop-blur-lg min-h-[230px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-400/20" />
                <div className="relative">
                    <Icon className="mb-4 h-12 w-12 text-blue-300" />
                    <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
                    <p className="text-blue-50">{description}</p>
                </div>
            </Card>
        </motion.div>
    );
}
