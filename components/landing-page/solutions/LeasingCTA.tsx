'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export function LeasingCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-12 text-center"
    >
      <Button
        size="lg"
        className="group relative overflow-hidden bg-white px-8 py-6 text-blue-900 hover:bg-blue-50"
      >
        <Settings className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
        Demander une configuration
      </Button>
    </motion.div>
  );
}
