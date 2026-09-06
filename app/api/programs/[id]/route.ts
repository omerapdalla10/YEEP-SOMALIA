import { resourceItem } from "@/lib/api/resource";
import { programs } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(programs.model, programs.config);
