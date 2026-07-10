import { Schema } from "effect"

export const Permission = {
  AppAccess: "app:access",
} as const

export const permissionSchema = Schema.String

export type Permission = typeof permissionSchema.Type
