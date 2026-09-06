import { resourceCollection } from "@/lib/api/resource";
import { team } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(team.model, team.config);
