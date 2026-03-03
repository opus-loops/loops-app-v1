import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { certificateNotFoundErrorSchema } from "@/modules/shared/domain/errors/certificate-not-found"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { certificateSchema } from "@/modules/shared/domain/entities/certificate"
import {
  UseCaseErrorSchema,
  invalidInputFactory,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

export const getCertificateArgsSchema = Schema.Struct({
  categoryId: Schema.String,
})

export type GetCertificateArgs = typeof getCertificateArgsSchema.Type

export const getCertificateErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(UseCaseErrorSchema),
      categoryId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  certificateNotFoundErrorSchema,
  categoryNotStartedErrorSchema,
  categoryNotFoundErrorSchema,
  userNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
)

export type GetCertificateErrors = typeof getCertificateErrorsSchema.Type

export const getCertificateSuccessSchema = Schema.Struct({
  certificate: certificateSchema,
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
