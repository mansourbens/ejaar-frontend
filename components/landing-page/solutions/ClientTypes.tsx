'use client';

import { motion } from 'framer-motion';

export function ClientTypes() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
        >
            <h3 className="text-xl font-medium text-blue-900 lato-bold">
                Pour tous type d&apos;acteur
            </h3>
            <p className="mt-2 text-lg text-blue-800 lato-regular">
                TPE/PME/ ETI professions libérales / Auto entrepreneurs
            </p>
        </motion.div>
    );
}
