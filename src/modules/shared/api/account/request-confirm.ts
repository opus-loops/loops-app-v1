import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { invalidOperationErrorSchema } from "@/modules/shared/domain/errors/invalid-operation"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { successResponseWithPayloadSchemaFactory } from "@/modules/shared/domain/types/success-response"
import {
  UseCaseErrorSchema,
  invalidInputFactory,
} from "@/modules/shared/domain/utils/invalid-input"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import type { Effect } from "effect"
import { Schema } from "effect"
import { instanceFactory } from "../../utils/axios"

export const requestConfirmErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
  invalidOperationErrorSchema,
)

export type RequestConfirmErrors = typeof requestConfirmErrorsSchema.Type

export const requestConfirmSuccessSchema =
  successResponseWithPayloadSchemaFactory(
    Schema.Struct({ expiresAt: Schema.DateFromString }),
  )

type RequestConfirmResult = Effect.Effect<
  RequestConfirmSuccess,
  RequestConfirmErrors
>
type RequestConfirmSuccess = typeof requestConfirmSuccessSchema.Type

export const requestConfirmExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: requestConfirmErrorsSchema,
  success: requestConfirmSuccessSchema,
})

export const requestConfirmFactory = async () => {
  const instance = await instanceFactory()

  return function requestConfirm(): RequestConfirmResult {
    const response = instance.post("/account/request")

    return parseApiResponse({
      error: {
        name: "RequestConfirmErrors",
        schema: requestConfirmErrorsSchema,
      },
      name: "RequestConfirm",
      success: {
        name: "RequestConfirmSuccess",
        schema: requestConfirmSuccessSchema,
      },
    })(response)
  }
}
