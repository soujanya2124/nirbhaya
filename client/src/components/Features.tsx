import { PhoneCall, Bell, LogIn } from "lucide-react";
import FeatureCard from "./FeatureCard";
import SOSDemo from "./SOSDemo";
import GeofencingDemo from "./GeofencingDemo";

export default function Features() {
  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Key Features for Your Safety
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={PhoneCall}
            title="SOS Emergency Call"
            description="Instantly connect to the nearest police station with one tap. Help is always just a button away."
            delay={0.1}
          />

          <FeatureCard
            icon={Bell}
            title="Emergency Alerts"
            description="Automatically notify your trusted contacts with your location when you need assistance."
            delay={0.2}
          />

          <FeatureCard
            icon={LogIn}
            title="Quick Access"
            description="Simple phone number login with Google integration for a seamless experience."
            delay={0.3}
          />
        </div>

        <div className="space-y-20">
          <div>
            <h3 className="text-2xl font-bold text-center mb-8">
              Try Our SOS Feature Demo
            </h3>
            <SOSDemo />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-center mb-8">
              Location-Based Safety Zones
            </h3>
            <GeofencingDemo />
          </div>
        </div>
      </div>
    </section>
  );
}