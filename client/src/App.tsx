import { Switch, Route } from "wouter";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AuthPage from "@/pages/AuthPage";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SOSDemo from "@/components/SOSDemo";
import GeofencingDemo from "@/components/GeofencingDemo";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

// Placeholder components until we implement the full features
const CommunityPage = () => (
  <Card className="p-6">
    <h2 className="text-2xl font-bold mb-4">Community</h2>
    <p className="text-muted-foreground">Connect with others and share experiences</p>
  </Card>
);

const TherapistPage = () => (
  <Card className="p-6">
    <h2 className="text-2xl font-bold mb-4">Talk to a Therapist</h2>
    <p className="text-muted-foreground">Connect with professional counselors</p>
  </Card>
);

const SettingsPage = () => (
  <Card className="p-6">
    <h2 className="text-2xl font-bold mb-4">Settings</h2>
    <p className="text-muted-foreground">Manage your account and preferences</p>
  </Card>
);

function App() {
  // For now, we'll show the auth page. Later we'll add proper auth state management
  const isAuthenticated = false;

  return (
    <ErrorBoundary>
      {!isAuthenticated ? (
        <AuthPage />
      ) : (
        <DashboardLayout>
          <Switch>
            <Route path="/sos" component={SOSDemo} />
            <Route path="/location" component={GeofencingDemo} />
            <Route path="/community" component={CommunityPage} />
            <Route path="/therapist" component={TherapistPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/" component={SOSDemo} />
          </Switch>
        </DashboardLayout>
      )}
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;