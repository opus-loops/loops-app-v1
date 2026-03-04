import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { useGoogleLogin } from "../services/use-google-login"
import { Button } from "@/modules/shared/components/ui/button"

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          cancel: () => void
          disableAutoSelect: () => void
          initialize: (config: IdConfiguration) => void
          onGoogleLibraryLoad: () => void
          prompt: (
            momentListener?: (notification: PromptMomentNotification) => void,
          ) => void
          renderButton: (
            element: HTMLElement,
            config: GsiButtonConfiguration,
          ) => void
          revoke: (
            hint: string,
            callback: (done: RevocationResponse) => void,
          ) => void
          storeCredential: (
            credential: { id: string; password: string },
            callback?: () => void,
          ) => void
        }
      }
    }
  }
}

interface CredentialResponse {
  clientId?: string
  credential: string
  select_by:
    | "auto"
    | "btn_add_session"
    | "btn_confirm_add_session"
    | "btn_confirm"
    | "btn"
    | "user_1tap"
    | "user_2tap"
    | "user"
}

interface GsiButtonConfiguration {
  click_listener?: () => void
  locale?: string
  logo_alignment?: "center" | "left"
  shape?: "circle" | "pill" | "rectangular" | "square"
  size?: "large" | "medium" | "small"
  text?: "continue_with" | "signin_with" | "signin" | "signup_with"
  theme?: "filled_black" | "filled_blue" | "outline"
  type?: "icon" | "standard"
  width?: number | string
}

// Types based on official Google Identity Services documentation
interface IdConfiguration {
  allowed_parent_origin?: Array<string> | string
  auto_select?: boolean
  callback?: (credentialResponse: CredentialResponse) => void
  cancel_on_tap_outside?: boolean
  client_id: string
  context?: "signin" | "signup" | "use"
  hd?: string
  intermediate_iframe_close_callback?: () => void
  itp_support?: boolean
  login_hint?: string
  login_uri?: string
  native_callback?: (response: { id: string; password: string }) => void
  nonce?: string
  prompt_parent_id?: string
  state_cookie_domain?: string
  use_fedcm_for_prompt?: boolean
  ux_mode?: "popup" | "redirect"
}

interface PromptMomentNotification {
  getDismissedReason: () =>
    | "cancel_called"
    | "credential_returned"
    | "flow_restarted"
  getMomentType: () => "dismissed" | "display" | "skipped"
  getNotDisplayedReason: () =>
    | "browser_not_supported"
    | "invalid_client"
    | "missing_client_id"
    | "opt_out_or_no_session"
    | "secure_http_required"
    | "suppressed_by_user"
    | "unknown_reason"
    | "unregistered_origin"
  getSkippedReason: () =>
    | "auto_cancel"
    | "issuing_failed"
    | "tap_outside"
    | "user_cancel"
  isDismissedMoment: () => boolean
  isDisplayed: () => boolean
  isDisplayMoment: () => boolean
  isNotDisplayed: () => boolean
  isSkippedMoment: () => boolean
}

interface RevocationResponse {
  error?: string
  successful: boolean
}

export function LoginGoogle() {
  const { t } = useTranslation()
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { handleGoogleLogin } = useGoogleLogin()

  useEffect(() => {
    const checkGoogleLoaded = () => {
      if (window.google?.accounts?.id) {
        setIsGoogleLoaded(true)
        initializeGoogle()
      } else setTimeout(checkGoogleLoaded, 100)
    }

    checkGoogleLoaded()
  }, [])

  const initializeGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    window.google.accounts.id.initialize({
      auto_select: false,
      callback: handleCredentialResponse,
      cancel_on_tap_outside: true,
      client_id: clientId,
      context: "signin",
      use_fedcm_for_prompt: false,
      ux_mode: "popup",
    })
  }

  // TODO: handle api response
  const handleCredentialResponse = async (response: CredentialResponse) => {
    setIsLoading(true)
    const googleToken = response.credential
    await handleGoogleLogin(googleToken)
    setIsLoading(false)
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        const reason = notification.getNotDisplayedReason()

        if (reason === "browser_not_supported")
          toast.error("Your browser doesn't support Google Sign-In.")
        else if (reason === "invalid_client" || reason === "missing_client_id")
          toast.error("Google Sign-In is not properly configured.")
        else if (reason === "opt_out_or_no_session")
          toast.info("Please sign in to your Google account first.")
        else if (reason === "secure_http_required")
          toast.error("Google Sign-In requires a secure connection (HTTPS).")
        else if (reason === "suppressed_by_user")
          toast.info("Google Sign-In was disabled by user preference.")
        else if (reason === "unregistered_origin")
          toast.error("This domain is not authorized for Google Sign-In.")
        else toast.error("Google Sign-In is not available right now.")

        setIsLoading(false)
      } else if (notification.getMomentType() === "skipped") {
        setIsLoading(false)
      } else if (notification.getMomentType() === "dismissed") {
        if (notification.getDismissedReason() !== "credential_returned") {
          setIsLoading(false)
        }
      }
    })
  }

  return (
    <Button
      className="font-outfit text-loops-text hover:bg-loops-google/80 bg-loops-google w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none disabled:cursor-not-allowed disabled:opacity-50"
      disabled={!isGoogleLoaded || isLoading}
      onClick={handleGoogleSignIn}
      ref={buttonRef}
      type="button"
    >
      {isLoading ? (
        <svg
          className="text-loops-text h-6 w-6 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          ></path>
        </svg>
      ) : (
        <>
          <svg
            fill="none"
            height={30}
            viewBox="0 0 25 24"
            width={31}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.3055 10.0415H21.5V10H12.5V14H18.1515C17.327 16.3285 15.1115 18 12.5 18C9.1865 18 6.5 15.3135 6.5 12C6.5 8.6865 9.1865 6 12.5 6C14.0295 6 15.421 6.577 16.4805 7.5195L19.309 4.691C17.523 3.0265 15.134 2 12.5 2C6.9775 2 2.5 6.4775 2.5 12C2.5 17.5225 6.9775 22 12.5 22C18.0225 22 22.5 17.5225 22.5 12C22.5 11.3295 22.431 10.675 22.3055 10.0415Z"
              fill="#FFC107"
            />
            <path
              d="M3.65295 7.3455L6.93845 9.755C7.82745 7.554 9.98045 6 12.5 6C14.0295 6 15.421 6.577 16.4805 7.5195L19.309 4.691C17.523 3.0265 15.134 2 12.5 2C8.65895 2 5.32795 4.1685 3.65295 7.3455Z"
              fill="#FF3D00"
            />
            <path
              d="M12.5 22C15.083 22 17.43 21.0115 19.2045 19.404L16.1095 16.785C15.0718 17.5742 13.8038 18.001 12.5 18C9.89903 18 7.69053 16.3415 6.85853 14.027L3.59753 16.5395C5.25253 19.778 8.61353 22 12.5 22Z"
              fill="#4CAF50"
            />
            <path
              d="M22.3055 10.0415H21.5V10H12.5V14H18.1515C17.7571 15.1082 17.0467 16.0766 16.108 16.7855L16.1095 16.7845L19.2045 19.4035C18.9855 19.6025 22.5 17 22.5 12C22.5 11.3295 22.431 10.675 22.3055 10.0415Z"
              fill="#1976D2"
            />
          </svg>
          {t("auth.login.google_login")}
        </>
      )}
    </Button>
  )
}
