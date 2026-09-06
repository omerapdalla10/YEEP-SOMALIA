import { resourceCollection } from "@/lib/api/resource";
import { events } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(events.model, events.config);
