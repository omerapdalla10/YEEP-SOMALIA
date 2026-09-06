import { resourceItem } from "@/lib/api/resource";
import { team } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(team.model, team.config);
