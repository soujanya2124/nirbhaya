import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-12 h-12 text-primary mr-2" />
          <h1 className="text-4xl md:text-6xl font-bold">Nirbhaya</h1>
        </div>
        
        <h2 className="text-2xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Your Safety Companion, Always By Your Side
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Empowering women with instant access to emergency services, trusted contacts, and a supportive community. Because your safety matters most.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Download Now
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
