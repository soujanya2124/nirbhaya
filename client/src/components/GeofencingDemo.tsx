import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Share2, Copy, Check, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export default function GeofencingDemo() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getLocation = async () => {
    try {
      setIsSharing(true);
      setError(null);

      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp
      });

      toast({
        title: "Location Updated",
        description: "Your current location has been fetched successfully.",
      });
    } catch (err: any) {
      console.error("Error getting location:", err);
      setError(err.message || "Failed to get your location");
      toast({
        title: "Error",
        description: err.message || "Failed to get your location",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const shareLocation = async () => {
    if (!location) return;

    const shareData = {
      title: "My Location",
      text: "Here's my current location",
      url: `https://maps.google.com/?q=${location.latitude},${location.longitude}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Your location has been shared.",
        });
      } else {
        throw new Error("Native sharing not supported");
      }
    } catch (err) {
      // Fallback to copying to clipboard
      await copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    if (!location) return;

    const locationUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    try {
      await navigator.clipboard.writeText(locationUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Location link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy location",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold">Quick Location Share</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={getLocation}
            className="w-full"
            disabled={isSharing}
          >
            {isSharing ? (
              <>
                <MapPin className="mr-2 h-4 w-4 animate-pulse" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Get Current Location
              </>
            )}
          </Button>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-destructive"
            >
              <AlertTriangle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-2">
                  Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(location.timestamp).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={shareLocation}
                  variant="secondary"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  className="flex-1"
                  onClick={copyToClipboard}
                  variant="secondary"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          <p className="text-sm text-muted-foreground text-center">
            Get your current location and share it instantly with others
          </p>
        </div>
      </CardContent>
    </Card>
  );
}