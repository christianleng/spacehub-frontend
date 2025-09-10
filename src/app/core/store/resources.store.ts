import {
  makeObservable,
  observable,
  action,
  runInAction,
  computed,
} from "mobx";
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
  resources: Record<string, IResourceForm>;
  error: Error | null;

  drawerOpen: boolean;
  resourceIds: string[];
  hydrate: (data: Record<string, IResourceForm>) => void;
  getResourceById: (id: string) => IResourceForm | undefined;
  setDrawerOpen: (open: boolean) => void;

  fetchResources: () => Promise<IResourceForm[]>;
  createResource: (values: IResourceForm) => Promise<IResourceForm | undefined>;
  updateResource: (
    id: string,
    values: Partial<IResourceForm>
  ) => Promise<IResourceForm | undefined>;
  deleteResource: (id: string) => Promise<boolean>;

  reset: () => void;
}

export class ResourcesStore implements IResourcesStore {
  loader: LoaderState = "init";
  resources: Record<string, IResourceForm> = {};
  error: Error | null = null;
  drawerOpen: boolean = false;

  constructor() {
    makeObservable(this, {
      loader: observable,
      resources: observable,
      error: observable,
      drawerOpen: observable,

      resourceIds: computed,

      hydrate: action,
      getResourceById: action,
      setDrawerOpen: action,
      fetchResources: action,
      createResource: action,
      updateResource: action,
      deleteResource: action,
      reset: action,
    });
  }

  get resourceIds() {
    return Object.keys(this.resources);
  }

  hydrate = (data: Record<string, IResourceForm>) => {
    if (data) this.resources = data;
  };

  getResourceById = (id: string) => this.resources[id];

  setDrawerOpen = (open: boolean) => {
    console.log("test");
    this.drawerOpen = open;
  };

  async fetchResources(): Promise<IResourceForm[]> {
    try {
      this.loader = this.resourceIds.length > 0 ? "mutation" : "loading";
      const res = await resourcesService.list();

      runInAction(() => {
        if (res.ok) {
          res.resources.forEach((r: IResourceForm) => {
            this.resources[r.id!] = r;
          });
        } else {
          this.error = new Error("Erreur lors du chargement des ressources");
          this.loader = "error";
        }
      });
      return res.ok ? res.resources : [];
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e : new Error(String(e));
        this.loader = "error";
      });
      throw e;
    } finally {
      runInAction(() => {
        this.loader = "loaded";
      });
    }
  }

  async createResource(
    values: IResourceForm
  ): Promise<IResourceForm | undefined> {
    try {
      this.loader = "mutation";
      const res = await resourcesService.create(values);
      runInAction(() => {
        if (res.ok) {
          const resource = res.resource as IResourceForm;
          this.resources[resource.id!] = resource;
        } else {
          this.error = new Error("Erreur lors de la création de la ressource");
          this.loader = "error";
        }
      });
      return res.ok ? (res.resource as IResourceForm) : undefined;
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e : new Error(String(e));
        this.loader = "error";
      });
      throw e;
    } finally {
      runInAction(() => {
        this.loader = "loaded";
      });
    }
  }

  async updateResource(
    id: string,
    values: Partial<IResourceForm>
  ): Promise<IResourceForm | undefined> {
    try {
      this.loader = "mutation";
      const res = await resourcesService.update(id, values);
      runInAction(() => {
        if (res.ok) {
          this.resources[id] = res.resource as IResourceForm;
        } else {
          this.error = new Error("Erreur lors de la mise à jour");
          this.loader = "error";
        }
      });
      return res.ok ? (res.resource as IResourceForm) : undefined;
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e : new Error(String(e));
        this.loader = "error";
      });
      throw e;
    } finally {
      runInAction(() => {
        this.loader = "loaded";
      });
    }
  }

  async deleteResource(id: string): Promise<boolean> {
    try {
      this.loader = "mutation";
      const res = await resourcesService.delete(id);
      runInAction(() => {
        if (res.ok) {
          delete this.resources[id];
        } else {
          this.error = new Error("Erreur lors de la suppression");
          this.loader = "error";
        }
      });
      return res.ok;
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e : new Error(String(e));
        this.loader = "error";
      });
      throw e;
    } finally {
      runInAction(() => {
        this.loader = "loaded";
      });
    }
  }

  reset() {
    this.resources = {};
    this.loader = "init";
    this.error = null;
  }
}

export const resourcesStore = new ResourcesStore();
