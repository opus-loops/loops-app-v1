import { z } from "zod"

export const authScreenSchema = z.enum(["login", "register"])

export const authSearchSchema = z.object({
  redirect: z.string().optional(),
  screen: authScreenSchema.optional(),
})

export type AuthScreen = z.infer<typeof authScreenSchema>
export type AuthSearch = z.infer<typeof authSearchSchema>

export function buildAuthSearch(
  screen: AuthScreen,
  redirect?: string,
): AuthSearch {
  if (redirect) return { redirect, screen }
  return { screen }
}

export function getSafeRedirectPath(redirect?: string) {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//"))
    return undefined

  return redirect
}
