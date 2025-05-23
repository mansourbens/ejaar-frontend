import React from "react";
import LandingPage from "@/components/landing-page/landing-page";
import Features from "@/components/landing-page/features";
import CTA from "@/components/landing-page/CTA";
import LandingNavbar from "@/components/landing-page/landing-navbar";
import LandingFooter from "@/components/landing-page/landing-footer";
import RentEstimation from "@/components/landing-page/rent-estimation";
import {Solutions} from "@/components/landing-page/solutions";

export default function Home() {
  return (
      <div className="min-h-screen lato-regular bg-[#fcf5eb]">
        <LandingNavbar />
        <main>
          <LandingPage />
          <Features />
            <Solutions></Solutions>
              <RentEstimation />
            <CTA />
        </main>
        <LandingFooter />
      </div>
  );
}
