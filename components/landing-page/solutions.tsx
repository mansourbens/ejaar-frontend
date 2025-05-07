'use client';

import { motion } from 'framer-motion';
import {EquipmentCard} from "@/components/landing-page/solutions/EquipmentCard";
import {LeasingCTA} from "@/components/landing-page/solutions/LeasingCTA";
import {ClientTypes} from "@/components/landing-page/solutions/ClientTypes";


export function Solutions() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-ejaar-950 via-ejaar-900 to-ejaar-800 py-16 text-white">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5,#0ea5e9)] opacity-50" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-4xl lato-bold">
                        Tous vos équipements, une seule solution de leasing
                    </h2>
                </motion.div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <EquipmentCard
                        title="Workstations hautes performances"
                        description="Des stations de travail puissantes pour vos besoins professionnels"
                    />
                    <EquipmentCard
                        title="Serveurs & réseaux sécurisés"
                        description="Infrastructure réseau robuste et sécurisée"
                    />
                    <EquipmentCard
                        title="Flottes mobiles & tablettes"
                        description="Solutions mobiles pour votre équipe"
                    />
                </div>

                <LeasingCTA />
                <ClientTypes />
            </div>
        </section>
    );
}
