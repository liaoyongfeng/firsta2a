export type UserRole = 'provider' | 'consumer';

export const USER_ROLE_KEY = 'firsta2a_user_role';

export const ROLE_ROUTES: Record<UserRole, string> = {
  provider: '/provider',
  consumer: '/academy',
};

const VALID_ROLES: ReadonlySet<string> = new Set<UserRole>(['provider', 'consumer']);

/**
 * Read and validate the user role from localStorage.
 * Returns null if not set, invalid, or localStorage is unavailable.
 */
export function getUserRole(): UserRole | null {
  try {
    const value = localStorage.getItem(USER_ROLE_KEY);
    if (value && VALID_ROLES.has(value)) {
      return value as UserRole;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save the user role to localStorage.
 */
export function setUserRole(role: UserRole): void {
  try {
    localStorage.setItem(USER_ROLE_KEY, role);
  } catch {
    // Silently fail if localStorage is unavailable (e.g. private browsing)
  }
}

/**
 * Remove the user role from localStorage.
 */
export function clearUserRole(): void {
  try {
    localStorage.removeItem(USER_ROLE_KEY);
  } catch {
    // Silently fail
  }
}
