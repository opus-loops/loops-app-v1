import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import type {
  UpdatePreferencesArgs,
  updatePreferencesErrorsSchema,
  updatePreferencesSuccessSchema,
} from "@/modules/shared/api/profile/update-preferences"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { uploadFileFactory } from "@/modules/shared/api/file/upload-file"
import { updatePreferencesFactory } from "@/modules/shared/api/profile/update-preferences"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"

// --- TYPES (pure TS) ---------------------------------------------------------
export type UpdatePreferencesErrors =
  | { code: "Unauthorized" }
  | typeof unknownErrorSchema.Type
  | typeof updatePreferencesErrorsSchema.Type

export type UpdatePreferencesFnArgs = {
  avatarFile?: File
} & UpdatePreferencesArgs

export type UpdatePreferencesSuccess =
  typeof updatePreferencesSuccessSchema.Type

// JSON-safe wire union
export type UpdatePreferencesWire =
  | {
      _tag: "Failure"
      error: UpdatePreferencesErrors
      uploadedAvatarURL?: string | undefined
    }
  | { _tag: "Success"; value: UpdatePreferencesSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const updatePreferencesFn = createServerFn({ method: "POST" })
  .inputValidator((data) => data as UpdatePreferencesFnArgs)
  .handler(async (ctx): Promise<UpdatePreferencesWire> => {
    const { avatarFile, ...preferences } = ctx.data
    let finalPreferences = preferences

    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Upload avatar if provided
    if (avatarFile) {
      const uploadFile = await uploadFileFactory()
      const formData = new FormData()
      formData.append("file", avatarFile)

      const uploadExit = await Effect.runPromiseExit(uploadFile({ formData }))

      if (uploadExit._tag === "Success") {
        finalPreferences = {
          ...preferences,
          avatarURL: uploadExit.value.fileUrl,
        }
      } else {
        const failure = Option.getOrElse(
          Cause.failureOption(uploadExit.cause),
          () => ({
            code: "UnknownError" as const,
          }),
        )
        // Map upload errors to UpdatePreferencesErrors or generic error
        // Note: You might want to define specific upload errors in UpdatePreferencesErrors union
        // For now, we return it as part of the failure
        return { _tag: "Failure", error: failure as any }
      }
    }

    // 2) Run your Effect on the server
    const updatePreferences = await updatePreferencesFactory()
    const exit = await Effect.runPromiseExit(
      updatePreferences(finalPreferences),
    )

    // 3) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: UpdatePreferencesWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(
        Cause.failureOption(exit.cause), //
        () => {
          // Fallback if you sometimes throw defects: map to a typed error variant in your union
          return {
            code: "UnknownError" as const,
          }
        },
      )
      wire = {
        _tag: "Failure",
        error: failure,
        uploadedAvatarURL: finalPreferences.avatarURL,
      }
    }

    // 4) Return JSON-serializable value (Start will serialize it)
    return wire
  })
