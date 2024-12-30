import { motion } from "framer-motion";
import { Shield, Heart, Phone } from "lucide-react";

export default function Safety() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1698716206713-b2a8c7e50267"
              alt="Empowered Woman"
              className="rounded-lg shadow-xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Safety is Our Priority
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">24/7 Protection</h3>
                  <p className="text-muted-foreground">
                    Round-the-clock access to emergency services and support whenever you need it.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Heart className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Trusted Network</h3>
                  <p className="text-muted-foreground">
                    Connect with verified contacts and build your safety network.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">One-Touch Help</h3>
                  <p className="text-muted-foreground">
                    Activate emergency protocols with a single tap in critical situations.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
