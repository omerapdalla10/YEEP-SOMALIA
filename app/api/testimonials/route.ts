import { resourceCollection } from "@/lib/api/resource";
import { testimonials } from "@/lib/api/resources";

export const { GET, POST } = resourceCollection(testimonials.model, testimonials.config);
