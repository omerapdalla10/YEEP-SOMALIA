import { resourceItem } from "@/lib/api/resource";
import { news } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(news.model, news.config);
