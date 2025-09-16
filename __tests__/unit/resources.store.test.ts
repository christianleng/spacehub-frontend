import { resourcesService } from "@/app/core/services/resources.service";
import {
  IResourceForm,
  ResourcesStore,
} from "@/app/core/store/resources.store";

jest.mock("@/app/core/services/resources.service", () => ({
  resourcesService: {
    list: jest.fn(),
    create: jest.fn(),
  },
}));

describe("ResourcesStore", () => {
  let store: ResourcesStore;

  beforeEach(() => {
    store = new ResourcesStore();
    jest.clearAllMocks();
  });

  it("setDrawerOpen() should update drawer state", () => {
    expect(store.drawerOpen).toBe(false);

    store.setDrawerOpen(true);
    expect(store.drawerOpen).toBe(true);

    store.setDrawerOpen(false);
    expect(store.drawerOpen).toBe(false);
  });

  it("fetchResources() should return resources when service succeeds", async () => {
    const mockResources: IResourceForm[] = [
      { id: "1", isActive: true, description: "Salle A" },
      { id: "2", isActive: false, description: "Salle B" },
    ];

    (resourcesService.list as jest.Mock).mockResolvedValueOnce({
      ok: true,
      resources: mockResources,
    });

    const res = await store.fetchResources();
    expect(res).toEqual(mockResources);
    expect(resourcesService.list).toHaveBeenCalledTimes(1);
  });

  it("fetchResources() should throw error when service fails", async () => {
    (resourcesService.list as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(store.fetchResources()).rejects.toThrow(
      "Erreur lors du chargement des ressources"
    );
  });

  it("createResource() should return resource when service succeeds", async () => {
    const mockResource: IResourceForm = {
      id: "1",
      isActive: true,
      description: "Nouvelle ressource",
    };

    (resourcesService.create as jest.Mock).mockResolvedValueOnce({
      ok: true,
      resource: mockResource,
    });

    const res = await store.createResource(mockResource);
    expect(res).toEqual(mockResource);
    expect(resourcesService.create).toHaveBeenCalledWith(mockResource);
  });

  it("createResource() should return undefined when service fails", async () => {
    const mockResource: IResourceForm = {
      id: "1",
      isActive: true,
      description: "Nouvelle ressource",
    };

    (resourcesService.create as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const res = await store.createResource(mockResource);
    expect(res).toBeUndefined();
  });
});
