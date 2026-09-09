import { resourceCollection } from "@/lib/api/resource";
import { reports } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(reports.model, reports.config);
