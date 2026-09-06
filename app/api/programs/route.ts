import { resourceCollection } from "@/lib/api/resource";
import { programs } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(programs.model, programs.config);
