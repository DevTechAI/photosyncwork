
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

  // Manager Dashboard - Enhanced with financial overview
  if (currentUser?.role === "manager" || currentUser?.role === "accounts") {
    return (
      <Layout>
        <AnimatedBackground />
        <ManagerDashboard />
      </Layout>
    );
  }

  // Photographer Dashboard
  if (currentUser?.role === "photographer") {
    return (
      <Layout>
        <AnimatedBackground />
        <PhotographerDashboard />
      </Layout>
    );
  }

  // Videographer Dashboard
  if (currentUser?.role === "videographer") {
    return (
      <Layout>
        <AnimatedBackground />
        <VideographerDashboard />
      </Layout>
    );
  }

  // Editor Dashboard
  if (currentUser?.role === "editor") {
    return (
      <Layout>
        <AnimatedBackground />
        <EditorDashboard />
      </Layout>
    );
  }

  // Default Dashboard (fallback)
  return (
    <Layout>
      <AnimatedBackground />
      <DefaultDashboard />
    </Layout>
  );
}
