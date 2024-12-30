import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { emergency_contacts, sos_settings, location_history } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Emergency Contacts Management
  app.post("/api/contacts", async (req, res) => {
    try {
      const { user_id, name, phone_number } = req.body;
      const [contact] = await db.insert(emergency_contacts)
        .values({ user_id, name, phone_number })
        .returning();
      res.json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  app.get("/api/contacts/:userId", async (req, res) => {
    try {
      const contacts = await db.select()
        .from(emergency_contacts)
        .where(eq(emergency_contacts.user_id, parseInt(req.params.userId)));
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // SOS Settings Management
  app.post("/api/sos-settings", async (req, res) => {
    try {
      const { user_id, default_message, auto_call_police } = req.body;
      const [settings] = await db.insert(sos_settings)
        .values({ user_id, default_message, auto_call_police })
        .returning();
      res.json(settings);
    } catch (error) {
      console.error("Error creating SOS settings:", error);
      res.status(500).json({ error: "Failed to create SOS settings" });
    }
  });

  app.get("/api/sos-settings/:userId", async (req, res) => {
    try {
      const [settings] = await db.select()
        .from(sos_settings)
        .where(eq(sos_settings.user_id, parseInt(req.params.userId)))
        .limit(1);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching SOS settings:", error);
      res.status(500).json({ error: "Failed to fetch SOS settings" });
    }
  });

  // SOS Trigger Endpoint
  app.post("/api/trigger-sos", async (req, res) => {
    try {
      const { user_id, latitude, longitude } = req.body;

      // 1. Log location
      const [location] = await db.insert(location_history)
        .values({ user_id, latitude, longitude, sos_triggered: true })
        .returning();

      // 2. Get user's emergency contacts
      const contacts = await db.select()
        .from(emergency_contacts)
        .where(eq(emergency_contacts.user_id, user_id));

      // 3. Get user's SOS settings
      const [settings] = await db.select()
        .from(sos_settings)
        .where(eq(sos_settings.user_id, user_id))
        .limit(1);

      // 4. Find nearest police station (mock implementation)
      const nearestPoliceStation = findNearestPoliceStation(latitude, longitude);

      // 5. Send alerts to emergency contacts (mock implementation)
      const message = settings?.default_message || "Emergency! I need help!";
      const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
      const fullMessage = `${message}\n${locationUrl}`;

      for (const contact of contacts) {
        await sendEmergencyMessage(contact.phone_number, fullMessage);
      }

      // 6. Call police if auto_call_police is enabled
      if (settings?.auto_call_police) {
        await initiatePoliceCall(nearestPoliceStation.phone, {
          latitude,
          longitude,
          user_id
        });
      }

      res.json({
        success: true,
        location,
        message: "SOS alert triggered successfully",
        notifiedContacts: contacts.length,
        policeStation: nearestPoliceStation
      });
    } catch (error) {
      console.error("Error triggering SOS:", error);
      res.status(500).json({ error: "Failed to trigger SOS alert" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Mock implementations of external services
// These would be replaced with actual API calls in production

interface PoliceStation {
  id: string;
  name: string;
  phone: string;
  distance: number;
}

function findNearestPoliceStation(latitude: string, longitude: string): PoliceStation {
  // Mock implementation - would be replaced with actual API call
  console.log(`Finding police station near ${latitude}, ${longitude}`);
  return {
    id: "PS001",
    name: "Central Police Station",
    phone: "+1234567890",
    distance: 1.5
  };
}

async function sendEmergencyMessage(phone: string, message: string): Promise<void> {
  // Mock implementation - would be replaced with actual SMS API
  console.log(`Sending emergency message to ${phone}: ${message}`);
}

async function initiatePoliceCall(phone: string, location: { latitude: string; longitude: string; user_id: number }): Promise<void> {
  // Mock implementation - would be replaced with actual emergency services API
  console.log(`Initiating police call to ${phone} for location:`, location);
}