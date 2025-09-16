import { makeObservable, observable, action } from "mobx";
import { resourcesService } from "../services/resources.service";
import { z } from "zod";

export const ResourceSchema = z.object({
  id: z.string().optional(),
  date: z.date().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  capacity: z.number().min(1).nullable().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
});

export type IResourceForm = z.infer<typeof ResourceSchema>;

export type LoaderState =
  | "init"
  | "loading"
  | "mutation"
  | "pagination"
  | "loaded"
  | "error";

export interface IResourcesStore {
  loader: LoaderState;
  error: Error | null;

  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;

  fetchResources: () => Promise<IResourceForm[]>;
  createResource: (values: IResourceForm) => Promise<IResourceForm | undefined>;
}

export class ResourcesStore implements IResourcesStore {
  loader: LoaderState = "init";
  error: Error | null = null;
  drawerOpen: boolean = false;

  constructor() {
    makeObservable(this, {
      loader: observable,
      error: observable,
      drawerOpen: observable,

      setDrawerOpen: action,
      fetchResources: action,
      createResource: action,
    });
  }

  setDrawerOpen = (open: boolean) => {
    this.drawerOpen = open;
  };

  fetchResources = async (): Promise<IResourceForm[]> => {
    const res = await resourcesService.list();
    if (!res.ok) throw new Error("Erreur lors du chargement des ressources");

    return res.resources;
  };

  createResource = async (
    values: IResourceForm
  ): Promise<IResourceForm | undefined> => {
    const res = await resourcesService.create(values);

    return res.ok ? (res.resource as IResourceForm) : undefined;
  };
}

export const resourcesStore = new ResourcesStore();
