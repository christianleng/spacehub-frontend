import { NextResponse } from "next/server";
import {
  createResource,
  deleteResource,
  listResources,
  updateResource,
} from "../server/actions/resources.action";
import { IResourceForm } from "../store/resources.store";

export class ResourcesService {
  async create(data: IResourceForm) {
    return await createResource(data);
  }

  async update(id: string, data: Partial<IResourceForm>) {
    return await updateResource(id, data);
  }

  async delete(id: string) {
    return await deleteResource(id);
  }

  async list() {
    return await listResources();
  }
}

export const resourcesService = new ResourcesService();
