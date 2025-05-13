"use client";
import {useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import MainLayout from "@/components/layouts/main-layout";
import EjaarSimulator from "@/components/ejaar-settings/ejaar-simulator";
import EjaarConfig from "@/components/ejaar-settings/ejaar-config";
import ResidualConfig from "@/components/ejaar-settings/residual-config";
import {RateConfig} from "@/components/ejaar-settings/rate-config";

const EjaarSettings = () => {

    return (
        <MainLayout>
            <div className="container px-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Each card will take full width on mobile, half on desktop */}
                    <div className="flex-1 min-w-0">
                        <ResidualConfig/>
                    </div>
                    <div className="flex-1 min-w-0">
                    <RateConfig/>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default EjaarSettings;
