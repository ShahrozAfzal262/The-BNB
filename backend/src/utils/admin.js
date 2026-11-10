// Who is an admin, and how much of every confirmed booking the platform ("The bnb") keeps.
// Change in backend/.env:  ADMIN_EMAILS=a@x.com,b@y.com   PLATFORM_FEE_PERCENT=10
export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "shahrozafzal262@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user) {
  return Boolean(user?.email) && adminEmails().includes(user.email.toLowerCase());
}

export function platformFeePercent() {
  const value = Number(process.env.PLATFORM_FEE_PERCENT);
  return Number.isFinite(value) && value >= 0 && value <= 100 ? value : 10;
}
