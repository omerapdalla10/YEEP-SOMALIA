import { resourceItem } from "@/lib/api/resource";
import { gallery } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(gallery.model, gallery.config);
