"use client";

import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconPlus, IconEdit } from "@tabler/icons-react";
import CreateResources from "@/features/resources/CreateResources";
import { useResources } from "@/app/core/hooks/store/use-resource";
import useSWR from "swr";
import ResourceSkeleton from "@/components/skeleton";
import CustomErrorComponent from "@/components/error";
import CustomEmptyStateComponent from "@/components/empty-state";

const Resources = observer(() => {
  const { fetchResources, setDrawerOpen } = useResources();

  const { data, isLoading, error } = useSWR("FETCH_RESOURCES", fetchResources, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return (
    <div className="p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Liste des ressources</h1>
        <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
          <IconPlus className="mr-1" />
          <span className="hidden lg:inline">Ajouter</span>
        </Button>
      </div>

      <CreateResources />

      {isLoading ? (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResourceSkeleton key={i} data-testid="resource-skeleton" />
          ))}
        </div>
      ) : error ? (
        <CustomErrorComponent error={error?.message} />
      ) : data?.length === 0 ? (
        <CustomEmptyStateComponent message={"Aucune ressource trouvée."} />
      ) : (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {data?.map((r) => (
            <Card key={r.id} className="flex gap-1 py-3">
              <CardHeader>
                <CardTitle className="text-xl">
                  Capacité : {r.capacity ?? "N/A"}
                </CardTitle>
                <CardDescription>
                  {r.description && r.description.trim() !== ""
                    ? r.description
                    : "Aucune description fournie"}
                </CardDescription>
                <CardAction className="flex items-top">
                  <Badge
                    variant="outline"
                    className={
                      r.isActive
                        ? "bg-green-100 text-green-700 border-green-300 shadow-sm"
                        : "bg-red-100 text-red-700 border-red-300 shadow-sm"
                    }
                  >
                    {r.isActive ? "Actif" : "Inactif"}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => console.log("Modifier", r.id)}
                  >
                    <IconEdit className="w-5 h-5" />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  {r.startTime} → {r.endTime}
                </div>
                <div className="text-muted-foreground">
                  Date :{" "}
                  {r.date ? new Date(r.date).toLocaleDateString() : "N/A"}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});

export default Resources;
