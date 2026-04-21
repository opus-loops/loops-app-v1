import type { Effect } from "effect"

import { Schema } from "effect"

import { certificateSchema } from "@/modules/shared/domain/entities/certificate"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

export const getCertificateArgsSchema = Schema.Struct({
  categoryId: Schema.String,
})

export type GetCertificateArgs = typeof getCertificateArgsSchema.Type

export const getCertificateErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      categoryId: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  invalidExpiredTokenErrorSchema,
)

export type GetCertificateErrors = typeof getCertificateErrorsSchema.Type

export const getCertificateSuccessSchema = Schema.Struct({
  certificate: Schema.NullOr(certificateSchema),
})

export type GetCertificateSuccess = typeof getCertificateSuccessSchema.Type

type GetCertificateResult = Effect.Effect<
  GetCertificateSuccess,
  GetCertificateErrors
>

export const getCertificateExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getCertificateErrorsSchema,
  success: getCertificateSuccessSchema,
})

export type GetCertificateExit = typeof getCertificateExitSchema.Type

export const getCertificateFactory = async () => {
  const instance = await instanceFactory()

  return function getCertificate(
    args: GetCertificateArgs,
  ): GetCertificateResult {
    const parsedArgs = parseEffectSchema(getCertificateArgsSchema, args)

    const url = `/explore/categories/${parsedArgs.categoryId}/certificate`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetCertificateErrors",
        schema: getCertificateErrorsSchema,
      },
      name: "GetCertificate",
      success: {
        name: "GetCertificateSuccess",
        schema: getCertificateSuccessSchema,
      },
    })(response)
  }
}
