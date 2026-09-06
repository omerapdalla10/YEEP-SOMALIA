import { resourceCollection } from "@/lib/api/resource";
import { milestones } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(milestones.model, milestones.config);
