import { toast as sonnerToast } from "sonner"

export interface ToastOptions {
  description?: string
  dismissible?: boolean
  duration?: number
  position?:
    | "bottom-center"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "top-left"
    | "top-right"
}

export interface UseToastReturn {
  dismiss: (id?: number | string) => void
  error: (message: string, options?: ToastOptions) => void
  success: (message: string, options?: ToastOptions) => void
}

export const useToast = (): UseToastReturn => {
  const success = (message: string, options: ToastOptions = {}) => {
    const { description, dismissible = true, duration = 5000 } = options

    sonnerToast.success(message, {
      className: "toast-success",
      description,
      dismissible,
      duration,
      style: {
        background: "var(--color-success)",
        border: "1px solid var(--color-success-border)",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
        color: "var(--color-success-foreground)",
        fontSize: "0.875rem",
        fontWeight: "500",
      },
    })
  }

  const error = (message: string, options: ToastOptions = {}) => {
    const { description, dismissible = true, duration = 5000 } = options

    sonnerToast.error(message, {
      className: "toast-error",
      description,
      dismissible,
      duration,
      style: {
        background: "var(--color-destructive)",
        border: "1px solid var(--color-destructive-border)",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
        color: "var(--color-destructive-foreground)",
        fontSize: "0.875rem",
        fontWeight: "500",
      },
    })
  }

  const dismiss = (id?: number | string) => {
    if (id) {
      sonnerToast.dismiss(id)
    } else {
      sonnerToast.dismiss()
    }
  }

  return {
    dismiss,
    error,
    success,
  }
}
