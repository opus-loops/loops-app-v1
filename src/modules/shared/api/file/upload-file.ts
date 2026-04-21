import type { Effect } from "effect"

import { Schema } from "effect"

import { invalidExpiredTokenErrorSchema } from "../../domain/errors/invalid-expired-token"
import { invalidFileErrorSchema } from "../../domain/errors/invalid-file"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "../../domain/utils/invalid-input"
import { instanceFactory } from "../../utils/axios"
import { parseApiResponse } from "../../utils/parse-api-response"
import { parseEffectSchema } from "../../utils/parse-effect-schema"

export const uploadFileArgsSchema = Schema.Struct({
  formData: Schema.Any, // FormData type
})

export type UploadFileArgs = typeof uploadFileArgsSchema.Type

export const uploadFileErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  invalidExpiredTokenErrorSchema,
  invalidFileErrorSchema,
)

export type UploadFileErrors = typeof uploadFileErrorsSchema.Type

export const uploadFileSuccessSchema = Schema.Struct({
  fileUrl: Schema.String,
})

export type UploadFileSuccess = typeof uploadFileSuccessSchema.Type

export const uploadFileExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: uploadFileErrorsSchema,
  success: uploadFileSuccessSchema,
})

type UploadFileResult = Effect.Effect<UploadFileSuccess, UploadFileErrors>

export const uploadFileFactory = async () => {
  const instance = await instanceFactory()

  return function uploadFile(args: UploadFileArgs): UploadFileResult {
    const parsedArgs = parseEffectSchema(uploadFileArgsSchema, args)
    const response = instance.post("/files/upload", parsedArgs.formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return parseApiResponse({
      error: {
        name: "UploadFileErrors",
        schema: uploadFileErrorsSchema,
      },
      name: "UploadFile",
      success: {
        name: "UploadFileSuccess",
        schema: uploadFileSuccessSchema,
      },
    })(response)
  }
}
