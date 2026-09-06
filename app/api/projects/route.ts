import { resourceCollection } from "@/lib/api/resource";
import { projects } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(projects.model, projects.config);
