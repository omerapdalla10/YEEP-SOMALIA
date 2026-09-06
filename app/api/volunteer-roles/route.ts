import { resourceCollection } from "@/lib/api/resource";
import { volunteerRoles } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(volunteerRoles.model, volunteerRoles.config);
