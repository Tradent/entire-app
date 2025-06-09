export const protectedRoutes = [
  "/profile",
  "/profile/edit",
  "/marketplace/profile",
  "/marketplace/create",
  "/badges",
  "/ar-try-on/gallery",
]

export function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`))
}
