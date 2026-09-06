import { resourceCollection } from "@/lib/api/resource";
import { partners } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(partners.model, partners.config);
