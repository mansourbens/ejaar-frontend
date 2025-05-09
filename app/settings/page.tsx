"use client";
import {useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import MainLayout from "@/components/layouts/main-layout";
import EjaarSimulator from "@/components/ejaar-settings/ejaar-simulator";
import EjaarConfig from "@/components/ejaar-settings/ejaar-config";

const EjaarSettings = () => {
    const [activeTab, setActiveTab] = useState('simulation');

    return (
        <MainLayout>
            <div className="container">

                <Tabs
                    defaultValue="simulation"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <div className="flex justify-center mb-6">
                        <TabsList className="grid grid-cols-2 w-[600px] gap-12">
                            <TabsTrigger
                                value="simulation"
                                className="bg-gray-100 border-2 border-ejaar-900 hover:bg-blue-100 hover:text-ejaar-800 data-[state=active]:bg-ejaar-800 data-[state=active]:text-white"
                            >
                                Simulation
                            </TabsTrigger>
                            <TabsTrigger
                                value="config"
                                className="bg-gray-100 data-[state=inactive]:border-2 data-[state=inactive]:border-ejaar-900 hover:bg-blue-100 hover:text-ejaar-800 data-[state=active]:bg-ejaar-800 data-[state=active]:text-white"
                            >
                                Configuration
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="simulation" className="mt-0">
                        <EjaarSimulator/>
                    </TabsContent>

                    <TabsContent value="config" className="mt-0">
                        <EjaarConfig/>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
};

export default EjaarSettings;
