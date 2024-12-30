import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, HeartHandshake } from "lucide-react";

export default function Community() {
  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Supportive Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with others, share experiences, and access professional support when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card p-6 rounded-lg border border-primary/20"
          >
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-muted-foreground mb-4">
              Share your stories, find support, and connect with others who understand your journey.
            </p>
            <img
              src="https://images.unsplash.com/photo-1524601500432-1e1a4c71d692"
              alt="Support Group"
              className="rounded-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card p-6 rounded-lg border border-primary/20"
          >
            <HeartHandshake className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Professional Therapy</h3>
            <p className="text-muted-foreground mb-4">
              Access confidential counseling services from certified professionals who care.
            </p>
            <img
              src="https://images.unsplash.com/photo-1484981138541-3d074aa97716"
              alt="Professional Counseling"
              className="rounded-lg"
            />
          </motion.div>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Join Our Community
          </Button>
        </div>
      </div>
    </section>
  );
}
