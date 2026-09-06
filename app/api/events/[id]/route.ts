import { resourceItem } from "@/lib/api/resource";
import { events } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(events.model, events.config);
