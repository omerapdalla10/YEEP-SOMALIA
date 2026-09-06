import { resourceItem } from "@/lib/api/resource";
import { testimonials } from "@/lib/api/resources";

export const { GET, PATCH, DELETE } = resourceItem(testimonials.model, testimonials.config);
