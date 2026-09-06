import { resourceItem } from "@/lib/api/resource";
import { partners } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(partners.model, partners.config);
