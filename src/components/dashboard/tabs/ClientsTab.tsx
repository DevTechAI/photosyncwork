
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientStats } from "@/components/clients/ClientStats";
import { ClientCard } from "@/components/clients/ClientCard";
import { clients } from "@/components/clients/mockClients";

export function ClientsTab() {
  return (
    <div className="space-y-6">
      <ClientStats />

      <Card>
        <CardHeader>
          <CardTitle>Client Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {clients.map((client) => (
              <ClientCard key={client.name} client={client} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
