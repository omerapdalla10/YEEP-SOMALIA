import { resourceItem } from "@/lib/api/resource";
import { reports } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(reports.model, reports.config);
