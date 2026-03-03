import { Schema } from "effect"
import type {
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  FormApi as TFormApi,
} from "@tanstack/react-form"

export const unknownErrorSchema = Schema.Struct({
  code: Schema.Literal("UnknownError"),
})

export type FormApi<TFormData> = TFormApi<
  TFormData,
  FormValidateOrFn<TFormData> | undefined,
  FormValidateOrFn<TFormData> | undefined,
  FormAsyncValidateOrFn<TFormData> | undefined,
  FormValidateOrFn<TFormData> | undefined,
  FormAsyncValidateOrFn<TFormData> | undefined,
  FormValidateOrFn<TFormData> | undefined,
  FormAsyncValidateOrFn<TFormData> | undefined,
  FormValidateOrFn<TFormData> | undefined,
  FormAsyncValidateOrFn<TFormData> | undefined,
  FormAsyncValidateOrFn<TFormData> | undefined,
  unknown
>

export type ProgressState = "completed" | "locked" | "started"
