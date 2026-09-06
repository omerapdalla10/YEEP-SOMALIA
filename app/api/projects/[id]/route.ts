import { resourceItem } from "@/lib/api/resource";
import { projects } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(projects.model, projects.config);
