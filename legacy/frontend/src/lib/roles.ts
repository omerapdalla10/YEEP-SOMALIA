export const ROLES = ['volunteer', 'staff', 'admin'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  volunteer: 'Volunteer',
  staff: 'Staff',
  admin: 'Administrator',
}

const RANK: Record<Role, number> = { volunteer: 1, staff: 2, admin: 3 }

/** True when `role` is at least as privileged as `required`. */
export function roleAtLeast(role: string | undefined, required: Role): boolean {
  const r = RANK[role as Role]
  return r !== undefined && r >= RANK[required]
}

export function roleLabel(role: string | undefined): string {
  return ROLE_LABELS[role as Role] ?? 'Member'
}

/** Colour classes for a role badge. */
export function roleBadgeClass(role: string | undefined): string {
  if (role === 'admin') return 'bg-purple-100 text-purple-700'
  if (role === 'staff') return 'bg-blue-100 text-blue-700'
  return 'bg-teal-50 text-[#0f766e]'
}
