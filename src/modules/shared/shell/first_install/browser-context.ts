export type InAppBrowserContext = "facebook" | "instagram" | "other"

export function getInAppBrowserContext(): InAppBrowserContext {
  if (typeof navigator === "undefined") return "other"

  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes("instagram")) return "instagram"
  if (
    userAgent.includes("fban") ||
    userAgent.includes("fbav") ||
    userAgent.includes("fb_iab") ||
    userAgent.includes("fb4a") ||
    userAgent.includes("fbios")
  )
    return "facebook"

  return "other"
}
