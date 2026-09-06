/**
 * Role-based access control — three ranked roles.
 *
 *  - `volunteer` — a registered member: manages their own profile and
 *    applications, reads public content. Default for public sign-ups.
 *  - `staff`     — content team / coordinator: full CRUD on programs, projects,
 *    events, news, gallery, team, testimonials, partners; reviews volunteer
 *    applications and the contact inbox. Cannot touch user accounts or settings.
 *  - `admin`     — everything, including user-account management.
 *
 * Higher ranks inherit every lower-rank permission (see `authorize`).
 */
export const ROLES = ['volunteer', 'staff', 'admin'] as const
export type Role = (typeof ROLES)[number]

export const DEFAULT_ROLE: Role = 'volunteer'

export const ROLE_LABELS: Record<Role, string> = {
  volunteer: 'Volunteer',
  staff: 'Staff',
  admin: 'Administrator',
}

const RANK: Record<Role, number> = { volunteer: 1, staff: 2, admin: 3 }

/** True when `role` is at least as privileged as `required`. */
export function roleAtLeast(role: Role, required: Role): boolean {
  return RANK[role] >= RANK[required]
}

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}
