
import { useUser } from "@/contexts/UserContext";
import Layout from "@/components/Layout";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { DefaultDashboard } from "@/components/dashboard/DefaultDashboard";
import { PhotographerDashboard } from "@/components/dashboard/PhotographerDashboard";
import { VideographerDashboard } from "@/components/dashboard/VideographerDashboard";
import { EditorDashboard } from "@/components/dashboard/EditorDashboard";

export default function Dashboard() {
  const { currentUser } = useUser();

  // Manager Dashboard - Enhanced with financial overview
  if (currentUser?.role === "manager" || currentUser?.role === "accounts") {
    return (
      <Layout>
        <ManagerDashboard />
      </Layout>
    );
  }

  // Photographer Dashboard
  if (currentUser?.role === "photographer") {
    return (
      <Layout>
        <PhotographerDashboard />
      </Layout>
    );
  }

  // Videographer Dashboard
  if (currentUser?.role === "videographer") {
    return (
      <Layout>
        <VideographerDashboard />
      </Layout>
    );
  }

  // Editor Dashboard
  if (currentUser?.role === "editor") {
    return (
      <Layout>
        <EditorDashboard />
      </Layout>
    );
  }

  // Default Dashboard (fallback)
  return (
    <Layout>
      <DefaultDashboard />
    </Layout>
  );
}
