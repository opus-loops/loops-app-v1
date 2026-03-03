import { useForm } from "@tanstack/react-form"
import { useTranslation } from "react-i18next"

import { useSubmitVoucher } from "../services/use-submit-voucher"
import { CodeInputGroup } from "@/modules/shared/components/common/code-input-group"
import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"

type VoucherSubmissionFormProps = {
  categoryId: string
  onSuccess: () => void
}

export function VoucherSubmissionForm({
  categoryId,
  onSuccess,
}: VoucherSubmissionFormProps) {
  const { error } = useToast()
  const { handleSubmitVoucher } = useSubmitVoucher()
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: { code: "" },
    onSubmit: async ({ value }) => {
      const code = parseInt(value.code, 10)
      if (isNaN(code) || value.code.length !== 5) {
        form.setFieldMeta("code", (prev) => ({
          ...prev,
          errorMap: { onSubmit: t("voucher.errors.invalid_format") },
          errors: [t("voucher.errors.invalid_format")],
        }))
        return
      }

      const response = await handleSubmitVoucher(categoryId, code)

      if (response._tag === "Failure") {
        if (response.error.code === "invalid_input") {
          form.setFieldMeta("code", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("voucher.errors.invalid_code") },
            errors: [t("voucher.errors.invalid_code")],
          }))
          return
        }
        error(t("voucher.errors.invalid_code"))
        return
      }

      onSuccess()
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field name="code">
        {(field) => (
          <div className="space-y-2">
            <CodeInputGroup
              length={5}
              onChange={(value) => field.handleChange(value)}
            />
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <div className="flex w-full items-center gap-x-2">
                <div className="text-loops-wrong size-4 shrink-0 grow-0">
                  <DangerIcon />
                </div>
                <p className="text-loops-wrong font-outfit text-sm leading-5">
                  {field.state.meta.errors.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-6 text-base leading-5 font-semibold capitalize shadow-none transition-all duration-200"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Submitting..." : "Submit Voucher"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
