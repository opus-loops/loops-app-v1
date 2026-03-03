import { Schema } from "effect"

import { roleSchema } from "../value_objects/role"

export const userSchema = Schema.Struct({
  avatarURL: Schema.String,
  background: Schema.optional(Schema.String),
  birthDate: Schema.optional(Schema.DateFromString),
  city: Schema.optional(Schema.String),
  codingExperience: Schema.optional(Schema.String),
  country: Schema.optional(Schema.String),
  createdAt: Schema.DateFromString,
  currentCategory: Schema.optional(Schema.String),
  duration: Schema.optional(Schema.Number.pipe(Schema.int())),
  email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  fullName: Schema.String,
  gender: Schema.optional(Schema.String),
  globalXP: Schema.Number.pipe(Schema.int()),
  goals: Schema.optional(Schema.String),
  interests: Schema.optional(Schema.String),
  isConfirmed: Schema.Boolean,
  isFirstTime: Schema.Boolean,
  isProfileCompleted: Schema.Boolean,
  language: Schema.Literal("en", "fr", "ar"),
  phoneNumber: Schema.optional(Schema.String),
  role: roleSchema,
  state: Schema.optional(Schema.String),
  updatedAt: Schema.DateFromString,
  userId: Schema.String,
  username: Schema.String,
})

export type User = typeof userSchema.Type
