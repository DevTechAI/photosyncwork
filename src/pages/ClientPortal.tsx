
import { useState } from "react";
import { useClientPortal } from "@/hooks/clientPortal/useClientPortal";
import { ClientLogin } from "@/components/clientPortal/ClientLogin";
import { ClientDashboard } from "@/components/clientPortal/ClientDashboard";

export default function ClientPortal() {
  const [accessCode, setAccessCode] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { portalData, loading, error, submitFeedback, downloadFile } = useClientPortal(
    isAuthenticated ? accessCode : ""
  );

  const handleLogin = (code: string) => {
    setAccessCode(code);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAccessCode("");
    setIsAuthenticated(false);
  };

  // Show login if not authenticated or still loading
  if (!isAuthenticated || (isAuthenticated && loading)) {
    return (
      <ClientLogin 
        onLogin={handleLogin}
        loading={loading}
        error={error}
      />
    );
  }

  // Show error if authentication failed
  if (error || !portalData) {
    return (
      <ClientLogin 
        onLogin={handleLogin}
        loading={false}
        error={error || "Failed to load portal data"}
      />
    );
  }

  // Show dashboard if authenticated and data loaded
  return (
    <ClientDashboard
      portalData={portalData}
      onSubmitFeedback={submitFeedback}
      onDownloadFile={downloadFile}
      onLogout={handleLogout}
    />
  );
}
