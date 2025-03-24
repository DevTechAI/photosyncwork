
import Layout from "@/components/Layout";
import { useUser } from "@/contexts/UserContext";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { DefaultDashboard } from "@/components/dashboard/DefaultDashboard";
import { PhotographerDashboard } from "@/components/dashboard/PhotographerDashboard";
import { VideographerDashboard } from "@/components/dashboard/VideographerDashboard";
import { EditorDashboard } from "@/components/dashboard/EditorDashboard";
import { AnimatedBackground } from "@/components/webgl/AnimatedBackground";

export default function Index() {
  const { currentUser } = useUser();

  // Render an enhanced AnimatedBackground for all dashboard views
  const renderDashboard = () => {
    // Manager Dashboard - Enhanced with financial overview
    if (currentUser?.role === "manager" || currentUser?.role === "accounts") {
      return <ManagerDashboard />;
    }

    // Photographer Dashboard
    if (currentUser?.role === "photographer") {
      return <PhotographerDashboard />;
    }

    // Videographer Dashboard
    if (currentUser?.role === "videographer") {
      return <VideographerDashboard />;
    }

    // Editor Dashboard
    if (currentUser?.role === "editor") {
      return <EditorDashboard />;
    }

    // Default Dashboard (fallback)
    return <DefaultDashboard />;
  };

  return (
    <Layout>
      {/* Enhanced AnimatedBackground with improved particle system */}
      <AnimatedBackground />
      <div className="relative z-10 backdrop-blur-sm bg-white/10 p-6 rounded-lg shadow-xl">
        {renderDashboard()}
      </div>
    </Layout>
  );
}
