/**
 * Role-based access control — two ranked roles. There is no public sign-up:
 * every account is created by an admin from the console, so a role is always
 * assigned explicitly.
 *
 *  - `staff`  — content team / coordinator: full CRUD on programs, projects,
 *    events, news, gallery, team, testimonials, partners; reviews volunteer
 *    applications, event registrations and the contact inbox. Cannot touch
 *    user accounts.
 *  - `admin`  — everything, including user-account management.
 *
 * Higher ranks inherit every lower-rank permission.
 */
export const ROLES = ["staff", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  staff: "Staff",
  admin: "Administrator",
};

const RANK: Record<Role, number> = { staff: 1, admin: 2 };

/** True when `role` is at least as privileged as `required`. */
export function roleAtLeast(role: string | undefined, required: Role): boolean {
  const r = RANK[role as Role];
  return r !== undefined && r >= RANK[required];
}

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function roleLabel(role: string | undefined): string {
  return ROLE_LABELS[role as Role] ?? "Staff";
}

/** Colour classes for a role badge. */
export function roleBadgeClass(role: string | undefined): string {
  if (role === "admin") return "bg-purple-100 text-purple-700";
  return "bg-blue-100 text-blue-700";
}
