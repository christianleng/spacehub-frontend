"use client";

import { observer } from "mobx-react-lite";
import { resourcesStore } from "@/app/core/store/resources.store";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import CreateResources from "@/features/resources/CreateResources";

const Resources = observer(() => {
  useEffect(() => {
    resourcesStore.fetchResources();
  }, []);

  if (resourcesStore.loader === "init" || resourcesStore.loader === "loading")
    return <div>Chargement des ressources...</div>;
  if (resourcesStore.error)
    return (
      <div className="text-red-500">Erreur: {resourcesStore.error.message}</div>
    );
  if (Object.values(resourcesStore.resources).length === 0)
    return <p>Aucune ressource trouvée.</p>;

  const resources = Object.values(resourcesStore.resources);

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">Liste des ressources</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => resourcesStore.setDrawerOpen(true)}
        >
          <IconPlus />
          <span className="hidden lg:inline">Add Section</span>
        </Button>
      </div>

      <CreateResources />
      {resources.length === 0 ? (
        <p>Aucune ressource trouvée.</p>
      ) : (
        <ul className="space-y-2">
          {resources.map((r) => (
            <li
              key={r.id}
              className="border rounded p-2 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {r.description ?? "Sans description"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Capacité : {r.capacity ?? "—"}
                </p>
                <div className="flex">
                  <p className="text-sm">{r.startTime}</p>
                  <span>→</span>
                  <p className="text-sm">{r.endTime}</p>
                </div>
                <p className="text-sm">
                  Date : {r.date ? new Date(r.date).toLocaleDateString() : "—"}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  r.isActive
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {r.isActive ? "Actif" : "Inactif"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default Resources;
