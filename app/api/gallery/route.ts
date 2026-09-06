import { resourceCollection } from "@/lib/api/resource";
import { gallery } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(gallery.model, gallery.config);
