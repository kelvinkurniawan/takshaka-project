import { getUserWithRole } from "@/lib/session";

export type Role = "admin" | "editor" | "viewer";

/**
 * Check if user has required role(s)
 */
export async function hasRole(requiredRoles: Role | Role[]): Promise<boolean> {
  const user = await getUserWithRole();
  if (!user) return false;

  const rolesArray = Array.isArray(requiredRoles)
    ? requiredRoles
    : [requiredRoles];

  return rolesArray.includes(user.role as Role);
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin");
}

/**
 * Check if user is admin or editor
 */
export async function canEdit(): Promise<boolean> {
  return hasRole(["admin", "editor"]);
}

/**
 * Check if user can delete (only admin)
 */
export async function canDelete(): Promise<boolean> {
  return hasRole("admin");
}

/**
 * Verify authentication and return user with role or throw error
 */
export async function requireAuth() {
  const user = await getUserWithRole();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }
  return user;
}

/**
 * Verify user has specific role(s) or throw error
 */
export async function requireRole(requiredRoles: Role | Role[]) {
  const user = await getUserWithRole();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const rolesArray = Array.isArray(requiredRoles)
    ? requiredRoles
    : [requiredRoles];

  if (!rolesArray.includes(user.role as Role)) {
    throw new Error(`Forbidden: User role ${user.role} not allowed`);
  }

  return user;
}
