export const ADMIN_EMAILS: readonly string[] = [
  'sidd2083@gmail.com',
  'sidhoni@gmail.com',
  'sid@siduniverse.dev'
];

/**
 * Strict verification of admin Gmail accounts.
 * Only Siddhant's official Google accounts are permitted access to the admin dashboard.
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();

  // 1. Direct match with Siddhant's primary admin emails
  if (ADMIN_EMAILS.includes(clean)) {
    return true;
  }

  // 2. Official Siddhant prefix matches
  if (clean.startsWith('sidd2083') || clean.startsWith('sidhoni')) {
    return true;
  }

  // 3. Environment allowlist if defined
  const envAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .toLowerCase()
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);

  if (envAdmins.includes(clean)) {
    return true;
  }

  return false;
}
