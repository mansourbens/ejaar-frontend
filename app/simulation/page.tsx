"use client";

import EjaarSimulator from "@/components/ejaar-settings/ejaar-simulator";
import MainLayout from "@/components/layouts/main-layout";
import ResidualConfig from "@/components/ejaar-settings/residual-config";

export default function Page() {
    return (
        <MainLayout>
            <div className="container">
                <EjaarSimulator/>
            </div>
        </MainLayout>

    )}
