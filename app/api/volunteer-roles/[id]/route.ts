import { resourceItem } from "@/lib/api/resource";
import { volunteerRoles } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(volunteerRoles.model, volunteerRoles.config);
