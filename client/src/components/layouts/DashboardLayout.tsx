import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  MapPin,
  Users,
  MessageSquareHeart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "SOS", href: "/sos", icon: AlertCircle, color: "text-red-500" },
  { name: "Live Location", href: "/location", icon: MapPin, color: "text-blue-500" },
  { name: "Community", href: "/community", icon: Users, color: "text-green-500" },
  { name: "Talk to Therapist", href: "/therapist", icon: MessageSquareHeart, color: "text-purple-500" },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative z-50"
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.div>
          </Button>
          <div className="absolute left-1/2 top-4 -translate-x-1/2">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <span className="font-semibold">Nirbhaya</span>
            </div>
          </div>
          <Avatar className="h-8 w-8 relative z-50">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>

        <motion.div 
          animate={{ opacity: mobileMenuOpen ? 1 : 0, y: mobileMenuOpen ? 0 : -20 }}
          initial={{ opacity: 0, y: -20 }}
          className={`fixed inset-0 z-40 transform ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <div className="absolute inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />
          <nav className="relative pt-16 pb-6 px-6 flex flex-col space-y-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <a className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}>
                    <Icon className={`mr-3 h-5 w-5 ${item.color || "text-muted-foreground"}`} />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>
        </motion.div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-8 overflow-y-auto border-r bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-2">
              <Bell className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">Nirbhaya</span>
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-4 py-4">
            <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2 ring-offset-background">
              <AvatarImage src="" alt="User Profile" />
              <AvatarFallback className="text-xl">U</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="font-semibold">Welcome back</h2>
              <p className="text-sm text-muted-foreground">Stay safe with Nirbhaya</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link href={item.href}>
                          <a className={`group flex items-center gap-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                            location === item.href
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}>
                            <Icon className={`h-5 w-5 flex-shrink-0 ${item.color || ""}`} />
                            {item.name}
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              <li className="mt-auto">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  disabled
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Hide profile section on desktop as it's in the sidebar */}
            <div className="lg:hidden mb-8 flex flex-col items-center">
              <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2 ring-offset-background">
                <AvatarImage src="" alt="User Profile" />
                <AvatarFallback className="text-xl">U</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">Welcome back</h2>
              <p className="text-sm text-muted-foreground">Stay safe with Nirbhaya</p>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}