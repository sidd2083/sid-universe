const ADMIN_EMAILS: readonly string[] = [
  'raghurl.2072@gmail.com'
];

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}
