import { resourceItem } from "@/lib/api/resource";
import { milestones } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(milestones.model, milestones.config);
