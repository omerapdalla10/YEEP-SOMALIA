import { resourceCollection } from "@/lib/api/resource";
import { news } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(news.model, news.config);
