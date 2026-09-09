/**
 * The ten standard REST resources. Each entry pairs a Mongoose model with its
 * list/write config; `app/api/<name>/route.ts` and `.../[id]/route.ts` import
 * the matching entry so the two files never drift apart.
 */
import { defineResource } from "./resource";
import { Program } from "@/models/Program";
import { Project } from "@/models/Project";
import { Event } from "@/models/Event";
import { Article } from "@/models/Article";
import { GalleryItem } from "@/models/GalleryItem";
import { TeamMember } from "@/models/TeamMember";
import { Milestone } from "@/models/Milestone";
import { Testimonial } from "@/models/Testimonial";
import { Partner } from "@/models/Partner";
import { Report } from "@/models/Report";
import { VolunteerRole } from "@/models/VolunteerRole";
import {
  programSchema,
  projectSchema,
  eventSchema,
  articleSchema,
  gallerySchema,
  teamMemberSchema,
  milestoneSchema,
  testimonialSchema,
  partnerSchema,
  reportSchema,
  volunteerRoleSchema,
} from "@/lib/validators";

export const programs = defineResource(Program, {
  bodySchema: programSchema,
  filterable: ["category", "status", "featured", "region"],
  searchable: ["title", "summary", "description"],
  slug: true,
});

export const projects = defineResource(Project, {
  bodySchema: projectSchema,
  filterable: ["status", "category", "featured", "region"],
  searchable: ["title", "description", "location"],
  slug: true,
});

export const events = defineResource(Event, {
  bodySchema: eventSchema,
  filterable: ["type", "published", "featured", "month", "region"],
  searchable: ["title", "description", "location"],
  defaultSort: "startDate",
  slug: true,
});

export const news = defineResource(Article, {
  bodySchema: articleSchema,
  filterable: ["category", "published", "featured"],
  searchable: ["title", "excerpt", "content"],
  defaultSort: "-publishedAt",
  slug: true,
});

export const gallery = defineResource(GalleryItem, {
  bodySchema: gallerySchema,
  filterable: ["category", "type"],
  searchable: ["caption"],
  defaultSort: "order",
});

export const team = defineResource(TeamMember, {
  bodySchema: teamMemberSchema,
  filterable: ["active"],
  searchable: ["name", "role"],
  defaultSort: "order",
});

export const milestones = defineResource(Milestone, {
  bodySchema: milestoneSchema,
  searchable: ["year", "event"],
  defaultSort: "order",
});

export const testimonials = defineResource(Testimonial, {
  bodySchema: testimonialSchema,
  filterable: ["placement"],
  searchable: ["name", "text"],
  defaultSort: "order",
});

export const partners = defineResource(Partner, {
  bodySchema: partnerSchema,
  searchable: ["name"],
  defaultSort: "order",
});

export const reports = defineResource(Report, {
  bodySchema: reportSchema,
  filterable: ["kind", "published"],
  searchable: ["title", "summary", "year"],
  defaultSort: "order",
});

export const volunteerRoles = defineResource(VolunteerRole, {
  bodySchema: volunteerRoleSchema,
  filterable: ["open"],
  searchable: ["role", "skills"],
  defaultSort: "order",
});
