
import Layout from "@/components/Layout";
import { PostProductionEventList } from "@/components/workflow/post-production/PostProductionEventList";
import { PostProductionContent } from "@/components/workflow/post-production/PostProductionContent";
import { usePostProductionPage } from "@/hooks/post-production/usePostProductionPage";

export default function PostProductionPage() {
  const {
    activeTab,
    setActiveTab,
    events,
    selectedEvent,
    setSelectedEvent,
    teamMembers,
    isLoading,
    isMobile,
    handleUpdateEvents,
    handleLogTime
  } = usePostProductionPage();
  
  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Post-Production</h1>
          <p className="text-sm text-muted-foreground">
            Manage deliverables and track editing time
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <PostProductionEventList
              events={events}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
            />
          </div>
          
          <div className="lg:col-span-3">
            <PostProductionContent
              selectedEvent={selectedEvent}
              isLoading={isLoading}
              teamMembers={teamMembers}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleUpdateEvents={handleUpdateEvents}
              handleLogTime={handleLogTime}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
