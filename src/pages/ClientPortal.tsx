
import { useState } from "react";
import { useClientPortal } from "@/hooks/clientPortal/useClientPortal";
import { ClientLogin } from "@/components/clientPortal/ClientLogin";
import { ClientDashboard } from "@/components/clientPortal/ClientDashboard";

export default function ClientPortal() {
  const [accessCode, setAccessCode] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  
  const { portalData, loading, error, submitFeedback, downloadFile } = useClientPortal(
    isAuthenticated ? accessCode : ""
  );

  const handleLogin = async (code: string) => {
    setLoginLoading(true);
    setAccessCode(code);
    setIsAuthenticated(true);
    // The loading will be handled by useClientPortal hook
    // We'll reset loginLoading after the hook finishes
  };

  const handleLogout = () => {
    setAccessCode("");
    setIsAuthenticated(false);
    setLoginLoading(false);
  };

  // Reset login loading when the hook finishes loading
  if (isAuthenticated && !loading && loginLoading) {
    setLoginLoading(false);
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <ClientLogin 
        onLogin={handleLogin}
        loading={loginLoading}
        error={null}
      />
    );
  }

  // Show login with error if authentication failed
  if (error || !portalData) {
    return (
      <ClientLogin 
        onLogin={handleLogin}
        loading={loading}
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
