import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Bell, CheckCircle2, Plus, Save, Settings, Phone, UserPlus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";

interface Contact {
  id: number;
  name: string;
  phone_number: string;
  relationship: string;
  photo_url?: string;
}

interface SosSettings {
  default_message: string;
  auto_call_police: boolean;
}

const RELATIONSHIPS = ['Family', 'Friend', 'Neighbor', 'Coworker', 'Other'] as const;

export default function SOSDemo() {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [newContact, setNewContact] = useState({ 
    name: "", 
    phone_number: "", 
    relationship: "Family" as typeof RELATIONSHIPS[number],
    photo_url: "" 
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock user_id for demo - in production this would come from auth context
  const user_id = 1;

  // Fetch emergency contacts
  const { data: contacts = [], refetch: refetchContacts } = useQuery<Contact[]>({
    queryKey: ['/api/contacts', user_id],
    queryFn: () => fetch(`/api/contacts/${user_id}`).then(res => res.json())
  });

  // Fetch SOS settings
  const { data: settings } = useQuery<SosSettings>({
    queryKey: ['/api/sos-settings', user_id],
    queryFn: () => fetch(`/api/sos-settings/${user_id}`).then(res => res.json())
  });

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In production, this would upload to a proper file storage service
    // For demo, we'll use a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewContact(prev => ({
        ...prev,
        photo_url: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  // Add contact mutation
  const addContactMutation = useMutation({
    mutationFn: (contact: Omit<Contact, "id">) =>
      fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contact, user_id }),
      }).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Contact Added",
        description: "Emergency contact has been added successfully.",
      });
      setNewContact({ 
        name: "", 
        phone_number: "", 
        relationship: "Family",
        photo_url: "" 
      });
      refetchContacts();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update SOS settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: SosSettings) =>
      fetch('/api/sos-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSettings, user_id }),
      }).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "SOS settings have been updated successfully.",
      });
      setShowSettings(false);
    }
  });

  // Trigger SOS mutation
  const triggerSosMutation = useMutation({
    mutationFn: async (location: { latitude: string; longitude: string }) =>
      fetch('/api/trigger-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          ...location
        }),
      }).then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: "SOS Activated",
        description: `Alert sent to ${data.notifiedContacts} contacts. Emergency services contacted.`,
        variant: "destructive",
      });
    }
  });

  const activateSOS = async () => {
    if (isActive || !contacts.length) return;

    try {
      setIsActive(true);
      toast({
        title: "SOS Activated",
        description: "Emergency services are being contacted...",
        variant: "destructive",
      });

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      await triggerSosMutation.mutateAsync({
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString()
      });

      const sequence = [
        { step: 1, delay: 2000 },
        { step: 2, delay: 4000 },
        { step: 3, delay: 6000 },
      ];

      sequence.forEach(({ step: nextStep, delay }) => {
        setTimeout(() => setStep(nextStep), delay);
      });

      setTimeout(() => {
        setIsActive(false);
        setStep(0);
      }, 8000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to activate SOS",
        variant: "destructive",
      });
      setIsActive(false);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone_number || !newContact.relationship) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    addContactMutation.mutate(newContact);
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {/* Emergency Contacts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Emergency Contacts</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Add trusted contacts who will be notified in case of emergency
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Contact List */}
            {contacts.length > 0 && (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card/50">
                    <Avatar className="h-12 w-12">
                      {contact.photo_url ? (
                        <AvatarImage src={contact.photo_url} alt={contact.name} />
                      ) : (
                        <AvatarFallback>
                          {contact.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone_number}</p>
                      <p className="text-xs text-primary">{contact.relationship}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Contact Form */}
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Contact Photo</label>
                  <div className="mt-1 flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      {newContact.photo_url ? (
                        <AvatarImage src={newContact.photo_url} alt="Preview" />
                      ) : (
                        <AvatarFallback>
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Photo
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Contact Name</label>
                  <Input
                    placeholder="Enter contact name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    placeholder="Enter phone number"
                    value={newContact.phone_number}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone_number: e.target.value }))}
                    type="tel"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Relationship</label>
                  <Select
                    value={newContact.relationship}
                    onValueChange={(value) => 
                      setNewContact(prev => ({ ...prev, relationship: value as typeof RELATIONSHIPS[number] }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIPS.map((relationship) => (
                        <SelectItem key={relationship} value={relationship}>
                          {relationship}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={addContactMutation.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                Add Emergency Contact
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* SOS Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              animate={isActive ? {
                scale: [1, 1.1, 1],
                transition: { repeat: Infinity, duration: 1 }
              } : {}}
            >
              <Button
                size="lg"
                className={`w-32 h-32 rounded-full text-2xl font-bold ${
                  isActive ? 'bg-destructive hover:bg-destructive' : 'bg-primary hover:bg-primary/90'
                }`}
                onClick={activateSOS}
                disabled={isActive || !contacts.length}
              >
                SOS
              </Button>
            </motion.div>

            {/* Settings Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-destructive"
                >
                  <AlertCircle className="animate-pulse" />
                  <span>Emergency Services Contacted</span>
                </motion.div>
              )}
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-primary"
                >
                  <Bell className="animate-bounce" />
                  <span>Alert Sent to Emergency Contacts</span>
                </motion.div>
              )}
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-green-500"
                >
                  <CheckCircle2 />
                  <span>Location Shared Successfully</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            {!isActive && (
              <p className="text-sm text-muted-foreground text-center">
                {contacts.length === 0
                  ? "Add emergency contacts above before using SOS"
                  : "Click the SOS button to activate emergency response"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && settings && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">SOS Settings</h3>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (settings) {
                  updateSettingsMutation.mutate(settings);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Emergency Message</label>
                <Input
                  value={settings.default_message}
                  onChange={(e) =>
                    updateSettingsMutation.mutate({
                      ...settings,
                      default_message: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  This message will be sent along with your location to emergency contacts
                </p>
              </div>
              <Button type="submit" disabled={updateSettingsMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}