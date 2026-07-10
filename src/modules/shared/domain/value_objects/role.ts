import { Schema } from "effect"

export const roleIdSchema = Schema.String

export const roleSlugSchema = Schema.String

export type RoleId = typeof roleIdSchema.Type

export type RoleSlug = typeof roleSlugSchema.Type
