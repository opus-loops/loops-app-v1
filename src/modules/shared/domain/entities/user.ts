import { Schema } from "effect"

const StringField = Schema.String
const NumberField = Schema.Number.pipe(Schema.int())
const BooleanField = Schema.Boolean

export const User = Schema.Struct({
  avatarURL: StringField,
  background: Schema.optional(StringField),
  birthDate: Schema.optional(Schema.DateFromString),
  city: Schema.optional(StringField),
  codingExperience: Schema.optional(StringField),
  confirmationDate: Schema.optional(Schema.DateFromString),
  country: Schema.optional(StringField),
  createdAt: Schema.DateFromString,
  currentCategory: Schema.optional(StringField),
  deletedAt: Schema.optional(Schema.DateFromString),
  duration: Schema.optional(NumberField),
  email: StringField,
  fullName: StringField,
  gender: Schema.optional(StringField),
  globalXP: NumberField,
  goals: Schema.optional(StringField),
  interests: Schema.optional(StringField),
  isFirstTime: BooleanField,
  isProfileCompleted: BooleanField,
  language: Schema.Literal("en", "fr", "ar"),
  password: Schema.optional(StringField),
  phoneNumber: Schema.optional(StringField),
  provider: StringField,
  resetPasswordToken: Schema.optional(StringField),
  state: Schema.optional(StringField),
  timeZone: Schema.optional(StringField),
  updatedAt: Schema.DateFromString,
  userId: StringField,
  username: StringField,
})

export type User = typeof User.Type
